import os

def test_basic():
    print("🧪 Basic Functionality Test")
    print("=" * 40)
    
    # Test if we can import basic modules (after installation)
    try:
        import requests
        print("✅ requests module available")
    except ImportError:
        print("❌ requests module not installed")
    
    # Check if directories exist
    directories = ["knowledge-base", "vector-db", "uploads", "logs"]
    for dir_name in directories:
        dir_path = os.path.join(os.getcwd(), dir_name)
        if os.path.exists(dir_path):
            print(f"✅ Directory exists: {dir_name}")
        else:
            print(f"❌ Directory missing: {dir_name}")
    
    print("=" * 40)
    print("Run 'install_dependencies.bat' to install all requirements")

if __name__ == "__main__":
    test_basic()