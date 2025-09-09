import logging
import requests
import time
from typing import List, Dict, Optional
from document_processor import DocumentProcessor
from vector_db import VectorDatabase
from config import Config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f"{Config.LOG_DIR}/rag_pipeline.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class RAGPipeline:
    def __init__(self):
        logger.info("Initializing RAG Pipeline with Balanced Mode...")
        self.processor = DocumentProcessor()
        self.vector_db = VectorDatabase()
        self.retry_attempts = 3
        self.retry_delay = 2
        logger.info("RAG Pipeline initialized successfully in Balanced Mode")

    def ingest_documents(self, directory_path: str = None) -> bool:
        """Ingest documents from directory into vector database"""
        directory = directory_path or Config.KNOWLEDGE_BASE_DIR
        logger.info(f"Ingesting documents from: {directory}")
        
        try:
            # Process documents
            chunks = self.processor.process_directory(directory)
            
            if not chunks:
                logger.warning("No documents found or processed")
                return False
            
            # Add to vector database
            self.vector_db.add_documents(chunks)
            
            logger.info(f"Ingestion complete! Processed {len(chunks)} chunks from {directory}")
            return True
            
        except Exception as e:
            logger.error(f"Document ingestion failed: {e}")
            return False

    def query(self, question: str, top_k: int = 5) -> Dict:
        """Query the RAG system with balanced approach"""
        logger.info(f"Processing query: {question}")
        
        start_time = time.time()
        
        try:
            # Search for relevant context in knowledge base
            relevant_docs = self.vector_db.search_similar(question, top_k)
            context_used = bool(relevant_docs)
            
            # Build context from relevant documents
            context = self._build_context(relevant_docs)
            
            # Generate response using balanced approach
            answer = self._generate_response(question, context, context_used)
            
            # Calculate response time
            response_time = time.time() - start_time
            
            return {
                "answer": answer,
                "sources": list(set(doc["metadata"]["source"] for doc in relevant_docs)),
                "relevant_chunks": relevant_docs,
                "context_used": context_used,
                "confidence": self._calculate_confidence(relevant_docs),
                "response_time": round(response_time, 2)
            }
            
        except Exception as e:
            logger.error(f"Query processing failed: {e}")
            return {
                "answer": "I apologize, but I'm experiencing technical difficulties. Please try again later.",
                "sources": [],
                "context_used": False,
                "confidence": 0.0,
                "response_time": round(time.time() - start_time, 2),
                "error": str(e)
            }

    def _build_context(self, relevant_docs: List[Dict]) -> str:
        """Build context string from relevant documents"""
        if not relevant_docs:
            return "No relevant knowledge base content found for this question."
        
        context = "KNOWLEDGE BASE CONTENT:\n\n"
        
        for i, doc in enumerate(relevant_docs):
            source = doc["metadata"]["source"]
            similarity = doc.get("similarity", 0.0)
            context += f"--- Document {i+1}: {source} (Relevance: {similarity:.2f}) ---\n"
            context += doc["text"] + "\n\n"
        
        return context

    def _generate_response(self, question: str, context: str, context_used: bool) -> str:
        """Generate response using balanced approach"""
        if context_used:
            # Use knowledge base content with option to supplement with general knowledge
            prompt = self._build_knowledge_base_prompt(question, context)
        else:
            # No relevant context found, use general knowledge
            prompt = self._build_general_knowledge_prompt(question)
        
        return self._query_ollama_with_retry(prompt)

    def _build_knowledge_base_prompt(self, question: str, context: str) -> str:
        """Build prompt when knowledge base content is available"""
        return f"""You are an IT support expert assistant. Use the provided knowledge base content as your primary source, and supplement with your general knowledge when helpful.

{context}

USER QUESTION: {question}

INSTRUCTIONS:
1. FIRST answer based on the provided knowledge base content
2. If the knowledge base content is incomplete or doesn't fully address the question, you may supplement with your general IT knowledge
3. Clearly distinguish between information from the knowledge base and general knowledge
4. Cite specific documents when using information from them
5. Be specific, technical, and practical
6. If providing steps, make them actionable and sequential
7. If the knowledge base content seems incorrect or outdated, mention this cautiously

IT SUPPORT EXPERT ANSWER:"""

    def _build_general_knowledge_prompt(self, question: str) -> str:
        """Build prompt when no knowledge base content is available"""
        return f"""You are an IT support expert assistant. No relevant information was found in the knowledge base, so provide the best answer using your general IT knowledge.

USER QUESTION: {question}

INSTRUCTIONS:
1. Provide a helpful answer based on your general IT knowledge and best practices
2. Clearly state that this information is from general knowledge rather than specific organizational documentation
3. Be specific, technical, and practical
4. If providing steps, make them actionable and sequential
5. If you're uncertain about something, acknowledge the limitation
6. Focus on IT support, troubleshooting, and technical guidance

IT SUPPORT EXPERT ANSWER:"""

    def _query_ollama_with_retry(self, prompt: str) -> str:
        """Query Ollama with retry logic for reliability"""
        for attempt in range(self.retry_attempts):
            try:
                response = requests.post(
                    f"{Config.OLLAMA_URL}/api/generate",
                    json={
                        "model": Config.OLLAMA_MODEL,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": 0.1,
                            "top_p": 0.9,
                            "num_ctx": 4096,
                            "top_k": 40
                        }
                    },
                    timeout=120
                )
                response.raise_for_status()
                return response.json()["response"]
                
            except requests.exceptions.ConnectionError:
                if attempt < self.retry_attempts - 1:
                    logger.warning(f"Ollama connection failed, attempt {attempt + 1}/{self.retry_attempts}")
                    time.sleep(self.retry_delay)
                    continue
                else:
                    logger.error("Ollama connection failed after all retry attempts")
                    return "I apologize, but I'm unable to connect to the AI service. Please check if Ollama is running."
                    
            except requests.exceptions.Timeout:
                logger.error("Ollama request timed out")
                return "The request took too long to process. Please try again with a more specific question."
                
            except Exception as e:
                logger.error(f"Unexpected error querying Ollama: {e}")
                if attempt < self.retry_attempts - 1:
                    time.sleep(self.retry_delay)
                    continue
                else:
                    return "I encountered an unexpected error while processing your request. Please try again."

        return "I'm unable to process your request at this time. Please try again later."

    def _calculate_confidence(self, relevant_docs: List[Dict]) -> float:
        """Calculate confidence score based on search results"""
        if not relevant_docs:
            return 0.0
        
        # Calculate average similarity score
        similarities = [doc.get("similarity", 0.0) for doc in relevant_docs]
        avg_similarity = sum(similarities) / len(similarities)
        
        # Adjust confidence based on number of relevant documents
        document_confidence = min(1.0, len(relevant_docs) / 5.0)  # Max confidence at 5 documents
        
        # Combined confidence score
        return round(avg_similarity * document_confidence, 2)

    def get_stats(self) -> Dict:
        """Get pipeline statistics"""
        try:
            db_stats = self.vector_db.get_collection_stats()
            return {
                "vector_db_count": db_stats,
                "knowledge_base_path": Config.KNOWLEDGE_BASE_DIR,
                "mode": "balanced",
                "ollama_model": Config.OLLAMA_MODEL
            }
        except:
            return {
                "vector_db_count": "unknown",
                "knowledge_base_path": Config.KNOWLEDGE_BASE_DIR,
                "mode": "balanced",
                "ollama_model": Config.OLLAMA_MODEL
            }

    def clear_knowledge(self):
        """Clear all knowledge from vector database"""
        try:
            self.vector_db.clear_collection()
            logger.info("Knowledge base cleared successfully")
        except Exception as e:
            logger.error(f"Failed to clear knowledge base: {e}")
            raise

    def health_check(self) -> Dict:
        """Check system health"""
        try:
            # Check Ollama
            ollama_response = requests.get(f"{Config.OLLAMA_URL}/api/tags", timeout=10)
            ollama_ok = ollama_response.status_code == 200
            
            # Check vector database
            vector_db_ok = True  # Simplified check
            
            return {
                "ollama": "healthy" if ollama_ok else "unavailable",
                "vector_db": "healthy" if vector_db_ok else "unavailable",
                "mode": "balanced",
                "status": "healthy" if ollama_ok and vector_db_ok else "degraded"
            }
            
        except Exception as e:
            return {
                "ollama": "unavailable",
                "vector_db": "unknown",
                "mode": "balanced",
                "status": "unhealthy",
                "error": str(e)
            }

# Example usage and testing
if __name__ == "__main__":
    # Test the pipeline
    rag = RAGPipeline()
    
    # Health check
    health = rag.health_check()
    print(f"System Health: {health}")
    
    # Test queries
    test_queries = [
        "How do I troubleshoot HMI station issues?",  # Should use knowledge base
        "What's the best way to organize IT documentation?",  # Might use general knowledge
        "How do I reset a user password in Active Directory?",  # Could use both
        "What's the recipe for chocolate cake?"  # Should use general knowledge (but IT-focused)
    ]
    
    for query in test_queries:
        print(f"\n🔍 Query: {query}")
        result = rag.query(query)
        print(f"🤖 Answer: {result['answer'][:200]}...")  # First 200 chars
        print(f"📚 Sources: {result['sources']}")
        print(f"🎯 Context used: {result['context_used']}")
        print(f"💪 Confidence: {result['confidence']}")
        print(f"⏱️ Response time: {result['response_time']}s")
        print("-" * 80)