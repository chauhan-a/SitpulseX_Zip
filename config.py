import os

# Base directory
BASE_DIR = r"C:\Users\arvindsingh.chauhan\OneDrive - HCL Technologies Ltd\Desktop\Ollama SitepulseX\Lovable Clone"

# Your specific installation paths
OLLAMA_INSTALL_PATH = r"C:\Users\arvindsingh.chauhan\AppData\Local\Programs\Ollama"
OLLAMA_MODELS_PATH = r"C:\Users\arvindsingh.chauhan\.ollama\models"
PYTHON_PATH = r"C:\Users\arvindsingh.chauhan\AppData\Local\Programs\Python\Python313"
POCKETBASE_PATH = r"C:\Users\arvindsingh.chauhan\OneDrive - HCL Technologies Ltd\Desktop\Ollama SitepulseX\pocketbase_0.29.3_windows_amd64\pocketbase.exe"

class Config:
    # =========================================================================
    # Ollama Settings
    # =========================================================================
    OLLAMA_URL = "http://localhost:11434"
    OLLAMA_MODEL = "llama3.2"  # Default model
    OLLAMA_TIMEOUT = 120  # seconds
    OLLAMA_MAX_RETRIES = 3
    
    # Available model options
    AVAILABLE_MODELS = [
        "llama3.2", "llama3.2:latest", "llama3.2:3b", "llama3.2:1b",
        "mistral", "mistral:latest", "mistral:7b",
        "codellama", "codellama:latest", "codellama:7b",
        "phi3", "phi3:latest", "phi3:mini",
        "llava", "bakllava", "cogvlm"  # Multimodal models
    ]
    
    # =========================================================================
    # RAG Pipeline Settings
    # =========================================================================
    # Document Processing
    CHUNK_SIZE = 1000
    CHUNK_OVERLAP = 200
    MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
    
    # Vector Database
    VECTOR_DB_PATH = os.path.join(BASE_DIR, "vector-db")
    COLLECTION_NAME = "knowledge_docs"
    SIMILARITY_TOP_K = 5  # Number of results to retrieve
    
    # Search Settings
    SIMILARITY_THRESHOLD = 0.6  Minimum similarity score to consider relevant
    MAX_CONTEXT_LENGTH = 4000  # characters
    
    # =========================================================================
    # File Path Settings
    # =========================================================================
    KNOWLEDGE_BASE_DIR = os.path.join(BASE_DIR, "knowledge-base")
    VECTOR_DB_PATH = os.path.join(BASE_DIR, "vector-db")
    UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
    LOG_DIR = os.path.join(BASE_DIR, "logs")
    TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
    STATIC_DIR = os.path.join(BASE_DIR, "static")
    MODELS_DIR = os.path.join(BASE_DIR, "models")
    
    # =========================================================================
    # OCR and Image Processing Settings
    # =========================================================================
    # Tesseract OCR Path (Windows) with fallback detection
    TESSERACT_PATH = None
    try:
        # Try to find Tesseract in common locations
        possible_paths = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
            os.path.join(os.environ.get('ProgramFiles', ''), "Tesseract-OCR", "tesseract.exe"),
            os.path.join(os.environ.get('ProgramFiles(x86)', ''), "Tesseract-OCR", "tesseract.exe")
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                TESSERACT_PATH = path
                break
                
    except Exception:
        TESSERACT_PATH = None
    
    # OCR availability flag
    OCR_AVAILABLE = TESSERACT_PATH is not None and os.path.exists(TESSERACT_PATH)
    
    # Poppler Path (for PDF to image conversion)
    POPPLER_PATH = r"C:\poppler\Library\bin"
    
    # Image Processing
    SUPPORTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp']
    MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB
    USE_OCR_FOR_IMAGES = True
    
    # =========================================================================
    # Multimodal Settings
    # =========================================================================
    MULTIMODAL_MODEL = "llava"  # Default multimodal model
    MULTIMODAL_ENABLED = True  # Set to True after installing multimodal model
    MULTIMODAL_MODELS = ["llava", "bakllava", "cogvlm"]
    
    # =========================================================================
    # API & Web Server Settings
    # =========================================================================
    API_HOST = "0.0.0.0"
    API_PORT = 8000
    DEBUG = True
    CORS_ORIGINS = ["*"]  # For development only
    
    # =========================================================================
    # Supported File Extensions
    # =========================================================================
    SUPPORTED_TEXT_EXTENSIONS = ['.pdf', '.docx', '.pptx', '.txt', '.md', '.csv', '.xlsx']
    SUPPORTED_EXTENSIONS = SUPPORTED_TEXT_EXTENSIONS + SUPPORTED_IMAGE_EXTENSIONS
    
    # =========================================================================
    # Performance Settings
    # =========================================================================
    MAX_CONCURRENT_UPLOADS = 5
    EMBEDDING_BATCH_SIZE = 32
    DB_FLUSH_INTERVAL = 60  # seconds
    
    # =========================================================================
    # Logging Settings
    # =========================================================================
    LOG_LEVEL = "INFO"  # DEBUG, INFO, WARNING, ERROR, CRITICAL
    LOG_FILE = os.path.join(LOG_DIR, "rag_system.log")
    MAX_LOG_SIZE = 10 * 1024 * 1024  # 10MB
    BACKUP_COUNT = 5
    
    # =========================================================================
    # Security Settings (for production)
    # =========================================================================
    API_KEY_ENABLED = False  # Set to True for production
    ALLOWED_FILE_TYPES = SUPPORTED_EXTENSIONS
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB max upload
    
    # =========================================================================
    # External Service Paths (Your specific installations)
    # =========================================================================
    OLLAMA_EXE_PATH = os.path.join(OLLAMA_INSTALL_PATH, "ollama.exe")
    POCKETBASE_EXE_PATH = POCKETBASE_PATH
    PYTHON_EXE_PATH = os.path.join(PYTHON_PATH, "python.exe")
    
    # =========================================================================
    # Chat & UI Settings
    # =========================================================================
    CHAT_HISTORY_LIMIT = 100  # messages per session
    SESSION_TIMEOUT = 3600  # 1 hour in seconds
    TYPING_INDICATOR_DELAY = 1  # second

# Initialize directories on import
def initialize_directories():
    """Ensure all required directories exist"""
    directories = [
        Config.KNOWLEDGE_BASE_DIR,
        Config.VECTOR_DB_PATH,
        Config.UPLOAD_DIR,
        Config.LOG_DIR,
        Config.TEMPLATES_DIR,
        Config.STATIC_DIR,
        Config.MODELS_DIR
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)

# Initialize directories when config is imported
initialize_directories()

# Configuration validation
def validate_config():
    """Validate configuration settings"""
    warnings = []
    
    # Check if Ollama is available
    if not os.path.exists(Config.OLLAMA_EXE_PATH):
        warnings.append("Ollama executable not found at expected path")
    
    # Check if Python is available
    if not os.path.exists(Config.PYTHON_EXE_PATH):
        warnings.append("Python executable not found at expected path")
    
    # Check if Tesseract is available for OCR
    if not Config.OCR_AVAILABLE:
        warnings.append("Tesseract OCR not available - image text extraction will be limited")
    
    # Check if multimodal is enabled but not configured
    if Config.MULTIMODAL_ENABLED and Config.MULTIMODAL_MODEL not in Config.MULTIMODAL_MODELS:
        warnings.append("Multimodal enabled but model not in supported list")
    
    return warnings

# Display configuration warnings on import
config_warnings = validate_config()
if config_warnings:
    print("⚠️  Configuration Warnings:")
    for warning in config_warnings:
        print(f"   - {warning}")