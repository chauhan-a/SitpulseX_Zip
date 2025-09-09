import logging
from rag_pipeline import RAGPipeline
from model_manager import ModelManager
from config import Config
import argparse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f"{Config.LOG_DIR}/rag_system.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def main():
    parser = argparse.ArgumentParser(description="Ollama RAG System with Your Local Setup")
    parser.add_argument("--ingest", action="store_true", help="Ingest documents from knowledge base")
    parser.add_argument("--query", type=str, help="Query to process")
    parser.add_argument("--clear", action="store_true", help="Clear vector database")
    parser.add_argument("--stats", action="store_true", help="Show statistics")
    parser.add_argument("--check", action="store_true", help="Check environment setup")
    parser.add_argument("--models", action="store_true", help="Show available models")
    parser.add_argument("--model", type=str, help="Set active model")
    
    args = parser.parse_args()
    
    # Check environment first
    if args.check:
        from check_environment import check_environment
        check_environment()
        return
    
    # Show available models
    if args.models:
        model_manager = ModelManager()
        available_models = model_manager.get_available_models()
        print("🤖 Available Ollama Models:")
        for model in available_models:
            print(f"  - {model}")
        return
    
    # Set active model
    if args.model:
        model_manager = ModelManager()
        if model_manager.set_active_model(args.model):
            print(f"✅ Set active model to: {args.model}")
        else:
            print(f"❌ Model not available: {args.model}")
        return
    
    # Initialize RAG pipeline
    rag = RAGPipeline()
    
    if args.ingest:
        logger.info("Starting document ingestion...")
        success = rag.ingest_documents()
        if success:
            logger.info("Document ingestion completed successfully!")
        else:
            logger.error("Document ingestion failed!")
    
    elif args.query:
        logger.info(f"Processing query: {args.query}")
        result = rag.query(args.query)
        print(f"\n🤖 ANSWER:\n{result['answer']}")
        print(f"\n📚 SOURCES: {result['sources']}")
        print(f"🎯 CONFIDENCE: {result['confidence']:.2f}")
    
    elif args.clear:
        rag.clear_knowledge()
        logger.info("Vector database cleared")
    
    elif args.stats:
        stats = rag.get_stats()
        print(f"📊 Vector DB documents: {stats['vector_db_count']}")
        print(f"📁 Knowledge base: {stats['knowledge_base_path']}")
    
    else:
        print("No action specified. Use --help for usage information.")

if __name__ == "__main__":
    main()