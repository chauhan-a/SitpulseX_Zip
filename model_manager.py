import requests
from config import Config

class ModelManager:
    def __init__(self):
        self.ollama_url = Config.OLLAMA_URL
    
    def get_available_models(self):
        """Get list of available models from Ollama"""
        try:
            response = requests.get(f"{self.ollama_url}/api/tags", timeout=10)
            if response.status_code == 200:
                return [model["name"] for model in response.json().get("models", [])]
            return []
        except:
            return []
    
    def pull_model(self, model_name):
        """Pull a new model from Ollama"""
        try:
            response = requests.post(
                f"{self.ollama_url}/api/pull",
                json={"name": model_name},
                timeout=300  # 5 minute timeout for model download
            )
            return response.status_code == 200
        except:
            return False
    
    def set_active_model(self, model_name):
        """Set the active model for the RAG system"""
        if model_name in self.get_available_models():
            # Update config or return model name
            return model_name
        return None
    
    def recommend_model(self):
        """Recommend the best model based on available options"""
        available_models = self.get_available_models()
        preferred_models = ["llama3.2", "mistral", "codellama", "phi3"]
        
        for model in preferred_models:
            if any(model in avail_model for avail_model in available_models):
                return model
        
        return available_models[0] if available_models else None