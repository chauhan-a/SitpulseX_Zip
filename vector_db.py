import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import logging
from typing import List, Dict
from config import Config

logger = logging.getLogger(__name__)

class VectorDatabase:
    def __init__(self):
        logger.info("Initializing Vector Database...")
        self.embedding_model = SentenceTransformer(Config.EMBEDDING_MODEL)
        
        # Initialize ChromaDB
        self.client = chromadb.PersistentClient(
            path=Config.VECTOR_DB_PATH,
            settings=Settings(anonymized_telemetry=False)
        )
        
        self.collection = self.client.get_or_create_collection(
            name=Config.COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"}
        )
        
        logger.info("Vector Database initialized successfully")
    
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for texts"""
        return self.embedding_model.encode(texts).tolist()
    
    def add_documents(self, documents: List[Dict]):
        """Add documents to vector database"""
        if not documents:
            logger.warning("No documents to add")
            return
        
        texts = [doc["text"] for doc in documents]
        metadatas = [doc["metadata"] for doc in documents]
        ids = [f"{md['source']}_{md['chunk_id']}" for md in metadatas]
        
        # Generate embeddings
        logger.info("Generating embeddings...")
        embeddings = self.generate_embeddings(texts)
        
        # Add to collection
        self.collection.add(
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas,
            ids=ids
        )
        
        logger.info(f"Added {len(documents)} documents to vector database")
    
    def search_similar(self, query: str, top_k: int = 5) -> List[Dict]:
        """Search for similar documents"""
        query_embedding = self.generate_embeddings([query])[0]
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            include=["documents", "metadatas", "distances"]
        )
        
        return [
            {
                "text": results["documents"][0][i],
                "metadata": results["metadatas"][0][i],
                "similarity": 1 - results["distances"][0][i]  # Convert distance to similarity
            }
            for i in range(len(results["documents"][0]))
        ]
    
    def get_collection_stats(self) -> Dict:
        """Get collection statistics"""
        return self.collection.count()
    
    def clear_collection(self):
        """Clear all documents from collection"""
        self.collection.delete(where={})
        logger.info("Vector database cleared")