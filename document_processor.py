import os
import logging
from typing import List, Dict
from unstructured.partition.pdf import partition_pdf
from unstructured.partition.docx import partition_docx
from unstructured.partition.pptx import partition_pptx
from unstructured.partition.text import partition_text
import pdf2image
import pytesseract
from PIL import Image
import pandas as pd
from config import Config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self):
        self.chunk_size = Config.CHUNK_SIZE
        self.chunk_overlap = Config.CHUNK_OVERLAP
        pytesseract.pytesseract.tesseract_cmd = Config.TESSERACT_PATH
    
    def chunk_text(self, text: str, source: str) -> List[Dict]:
        """Split text into overlapping chunks with metadata"""
        words = text.split()
        chunks = []
        chunk_id = 0
        
        while chunk_id * (self.chunk_size - self.chunk_overlap) < len(words):
            start = chunk_id * (self.chunk_size - self.chunk_overlap)
            end = start + self.chunk_size
            chunk_text = " ".join(words[start:end])
            
            chunks.append({
                "text": chunk_text,
                "metadata": {
                    "source": source,
                    "chunk_id": chunk_id,
                    "start_index": start,
                    "end_index": end
                }
            })
            chunk_id += 1
        
        return chunks
    
    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF with OCR fallback"""
        try:
            # Try direct text extraction first
            elements = partition_pdf(file_path, strategy="hi_res")
            text = "\n".join([str(el) for el in elements])
            
            # If little text found, try OCR
            if len(text.strip()) < 100:
                images = pdf2image.convert_from_path(file_path)
                ocr_text = ""
                for i, image in enumerate(images):
                    ocr_text += pytesseract.image_to_string(image) + "\n"
                text = ocr_text
                
            return text
        except Exception as e:
            logger.error(f"PDF extraction failed: {e}")
            return ""
    
    def process_document(self, file_path: str) -> List[Dict]:
        """Process any document type and return chunks"""
        ext = os.path.splitext(file_path).lower()
        source = os.path.basename(file_path)
        
        try:
            if ext == '.pdf':
                text = self.extract_text_from_pdf(file_path)
            elif ext == '.docx':
                elements = partition_docx(file_path)
                text = "\n".join([str(el) for el in elements])
            elif ext == '.pptx':
                elements = partition_pptx(file_path)
                text = "\n".join([str(el) for el in elements])
            elif ext in ['.txt', '.md']:
                elements = partition_text(file_path)
                text = "\n".join([str(el) for el in elements])
            elif ext in ['.csv', '.xlsx']:
                # Handle spreadsheets
                if ext == '.csv':
                    df = pd.read_csv(file_path)
                else:
                    df = pd.read_excel(file_path)
                text = df.to_string()
            elif ext in ['.jpg', '.jpeg', '.png']:
                # OCR for images
                text = pytesseract.image_to_string(Image.open(file_path))
            else:
                logger.warning(f"Unsupported file type: {ext}")
                return []
            
            return self.chunk_text(text, source)
            
        except Exception as e:
            logger.error(f"Error processing {file_path}: {e}")
            return []
    
    def process_directory(self, directory_path: str) -> List[Dict]:
        """Process all documents in a directory"""
        all_chunks = []
        
        for root, _, files in os.walk(directory_path):
            for file in files:
                if any(file.lower().endswith(ext) for ext in Config.SUPPORTED_EXTENSIONS):
                    file_path = os.path.join(root, file)
                    logger.info(f"Processing: {file_path}")
                    
                    chunks = self.process_document(file_path)
                    all_chunks.extend(chunks)
                    
                    logger.info(f"Extracted {len(chunks)} chunks from {file}")
        
        return all_chunks