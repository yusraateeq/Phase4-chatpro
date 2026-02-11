import openai
from typing import Dict, Any, Optional
from ..config.settings import settings
import logging

logger = logging.getLogger(__name__)


class OpenAIClient:
    """
    Singleton client for OpenAI API interactions
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if not self._initialized:
            self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
            self._initialized = True
    
    def test_connection(self) -> bool:
        """
        Test the OpenAI API connection
        """
        try:
            response = self.client.models.list()
            return len(response.data) > 0
        except Exception as e:
            logger.error(f"OpenAI API connection test failed: {str(e)}")
            return False
    
    def chat_completion(self, messages: list, model: str = None, **kwargs) -> Dict[str, Any]:
        """
        Make a chat completion request to OpenAI API
        """
        if model is None:
            model = settings.OPENAI_MODEL
            
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=messages,
                **kwargs
            )
            return response.model_dump()
        except Exception as e:
            logger.error(f"OpenAI chat completion failed: {str(e)}")
            raise