@echo off
cd /d "C:\Users\arvindsingh.chauhan\OneDrive - HCL Technologies Ltd\Desktop\Ollama SitepulseX\Lovable Clone"

echo Starting Ollama RAG System with your specific paths...
echo.

echo 1. Checking Ollama installation...
if exist "C:\Users\arvindsingh.chauhan\AppData\Local\Programs\Ollama\ollama.exe" (
    echo ✓ Ollama found at your specified path
) else (
    echo ✗ Ollama not found at expected path
    pause
    exit 1
)

echo 2. Checking Python installation...
if exist "C:\Users\arvindsingh.chauhan\AppData\Local\Programs\Python\Python313\python.exe" (
    echo ✓ Python found at your specified path
) else (
    echo ✗ Python not found at expected path
    pause
    exit 1
)

echo 3. Creating project directories...
if not exist knowledge-base mkdir knowledge-base
if not exist vector-db mkdir vector-db
if not exist uploads mkdir uploads
if not exist logs mkdir logs
if not exist scripts mkdir scripts

echo 4. Setting up Python virtual environment...
"C:\Users\arvindsingh.chauhan\AppData\Local\Programs\Python\Python313\python.exe" -m venv venv

echo 5. Activating environment...
call venv\Scripts\activate.bat

echo 6. Installing dependencies...
pip install -r requirements.txt

echo 7. Starting Ollama service (if not running)...
tasklist /fi "imagename eq ollama.exe" | find /i "ollama.exe" > nul
if errorlevel 1 (
    echo Starting Ollama service...
    start "" "C:\Users\arvindsingh.chauhan\AppData\Local\Programs\Ollama\ollama.exe" serve
    timeout /t 5 /nobreak
) else (
    echo ✓ Ollama is already running
)

echo 8. Starting PocketBase (if not running)...
tasklist /fi "imagename eq pocketbase.exe" | find /i "pocketbase.exe" > nul
if errorlevel 1 (
    echo Starting PocketBase...
    start "" "C:\Users\arvindsingh.chauhan\OneDrive - HCL Technologies Ltd\Desktop\Ollama SitepulseX\pocketbase_0.29.3_windows_amd64\pocketbase.exe" serve
    timeout /t 5 /nobreak
) else (
    echo ✓ PocketBase is already running
)

echo 9. Checking available Ollama models...
venv\Scripts\python.exe -c "
import requests
try:
    response = requests.get('http://localhost:11434/api/tags', timeout=10)
    if response.status_code == 200:
        models = response.json().get('models', [])
        print('Available models:')
        for model in models:
            print(f'  - {model[\"name\"]}')
    else:
        print('Could not fetch models from Ollama')
except Exception as e:
    print(f'Error connecting to Ollama: {e}')
"

echo 10. Starting document ingestion...
venv\Scripts\python.exe main.py --ingest

echo.
echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo Project Home: C:\Users\arvindsingh.chauhan\OneDrive - HCL Technologies Ltd\Desktop\Ollama SitepulseX\Lovable Clone
echo Ollama: http://localhost:11434
echo PocketBase: http://localhost:8090
echo API Server: http://localhost:8000
echo.
echo Usage:
echo   python main.py --ingest     - Process documents
echo   python main.py --query "your question" - Ask a question
echo   python main.py --stats      - Show statistics
echo.
pause