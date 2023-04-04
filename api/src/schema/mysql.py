"""schema for mysql"""
from datetime import datetime
from pydantic import BaseModel, Field

class InsertionError(Exception):
    """Cannnot insert data into mysql"""

class testData(BaseModel):
    """test data"""
    id: int =Field(..., description='unique id')