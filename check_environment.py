import os
import requests
import subprocess
from config import Config

def check_environment():
    print("🔍 Checking your local environment setup...")
    print("=" * 60)
    
    # Check Ollama
    print("1. Checking Ollama...")
    ollama_ok = os.path.exists(Config.OLLAMA_EXE_PATH)
    print(f"   Ollama executable: {'✓ Found' if ollama_ok else '✗ Missing'} at {Config.OLLAMA_EXE_PATH}")
    
    # Check Python
    print("2. Checking Python...")
    python_ok = os.path.exists(Config.PYTHON_EXE_PATH)
    print(f"   Python executable: {'✓ Found' if python_ok else '✗ Missing'} at {Config.PYTHON_EXE_PATH}")
    
    # Check PocketBase
    print("3. Checking PocketBase...")
    pocketbase_ok = os.path.exists(Config.POCKETBASE_EXE_PATH)
    print(f"   PocketBase executable: {'✓ Found' if pocketbase_ok else '✗ Missing'} at {Config.POCKETBASE_EXE_PATH}")
    
    # Check Ollama service
    print("4. Checking Ollama service...")
    try:
        response = requests.get(f"{Config.OLLAMA_URL}/api/tags", timeout=10)
        if response.status_code == 200:
            models = response.json().get('models', [])
            print(f"   ✓ Ollama service running with {len(models)} models")
            for model in models:
                print(f"     - {model['name']}")
        else:
            print("   ✗ Ollama service not responding properly")
    except:
        print("   ✗ Ollama service not running")
    
    # Check directories
    print("5. Checking project directories...")
    directories = [
        Config.KNOWLEDGE_BASE_DIR,
        Config.VECTOR_DB_PATH,
        Config.UPLOAD_DIR,
        Config.LOG_DIR
    ]
    
    for dir_path in directories:
        exists = os.path.exists(dir_path)
        print(f"   {os.path.basename(dir_path)}: {'✓ Exists' if exists else '✗ Missing'}")
    
    print("=" * 60)
    
    # Summary
    all_ok = ollama_ok and python_ok and pocketbase_ok
    if all_ok:
        print("✅ Environment setup is correct! You're ready to go.")
    else:
        print("❌ Some components are missing. Please check the paths above.")
    
    return all_ok

if __name__ == "__main__":
    check_environment()