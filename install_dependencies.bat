@echo off
cd /d "C:\Users\arvindsingh.chauhan\OneDrive - HCL Technologies Ltd\Desktop\Ollama SitepulseX\Lovable Clone"

echo Installing Python dependencies...
echo.

echo 1. Creating virtual environment...
"C:\Users\arvindsingh.chauhan\AppData\Local\Programs\Python\Python313\python.exe" -m venv venv

echo 2. Activating environment...
call venv\Scripts\activate.bat

echo 3. Installing core dependencies...
pip install requests sentence-transformers chromadb unstructured pillow python-multipart
pip install fastapi uvicorn python-docx pdfminer.six pypocketbase numpy

echo 4. Creating project directories...
if not exist knowledge-base mkdir knowledge-base
if not exist vector-db mkdir vector-db
if not exist uploads mkdir uploads
if not exist logs mkdir logs
if not exist templates mkdir templates
if not exist static mkdir static

echo.
echo ✅ Dependencies installed successfully!
echo.
pause