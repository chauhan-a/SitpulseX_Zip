import os
import subprocess
import sys

def check_environment():
    print("🔍 Checking Your Local Environment")
    print("=" * 50)
    
    # Check Python
    python_path = r"C:\Users\arvindsingh.chauhan\AppData\Local\Programs\Python\Python313\python.exe"
    python_ok = os.path.exists(python_path)
    print(f"Python: {'✅ Found' if python_ok else '❌ Missing'}")
    print(f"  Path: {python_path}")
    
    # Check Ollama
    ollama_path = r"C:\Users\arvindsingh.chauhan\AppData\Local\Programs\Ollama\ollama.exe"
    ollama_ok = os.path.exists(ollama_path)
    print(f"Ollama: {'✅ Found' if ollama_ok else '❌ Missing'}")
    print(f"  Path: {ollama_path}")
    
    # Check PocketBase
    pocketbase_path = r"C:\Users\arvindsingh.chauhan\OneDrive - HCL Technologies Ltd\Desktop\Ollama SitepulseX\pocketbase_0.29.3_windows_amd64\pocketbase.exe"
    pocketbase_ok = os.path.exists(pocketbase_path)
    print(f"PocketBase: {'✅ Found' if pocketbase_ok else '❌ Missing'}")
    print(f"  Path: {pocketbase_path}")
    
    # Check project directories
    print("\n📁 Project Directories:")
    base_dir = r"C:\Users\arvindsingh.chauhan\OneDrive - HCL Technologies Ltd\Desktop\Ollama SitepulseX\Lovable Clone"
    directories = ["knowledge-base", "vector-db", "uploads", "logs", "templates", "static"]
    
    for dir_name in directories:
        dir_path = os.path.join(base_dir, dir_name)
        exists = os.path.exists(dir_path)
        print(f"  {dir_name}: {'✅ Exists' if exists else '❌ Missing'}")
    
    # Check virtual environment
    venv_path = os.path.join(base_dir, "venv")
    venv_ok = os.path.exists(venv_path)
    print(f"Virtual Environment: {'✅ Exists' if venv_ok else '❌ Missing'}")
    
    print("=" * 50)
    
    if all([python_ok, ollama_ok, pocketbase_ok, venv_ok]):
        print("✅ Environment looks good! Run 'install_dependencies.bat' next.")
    else:
        print("❌ Some components are missing. Please check the paths above.")
    
    return all([python_ok, ollama_ok, pocketbase_ok, venv_ok])

if __name__ == "__main__":
    check_environment()