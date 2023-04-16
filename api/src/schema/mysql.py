"""schema for mysql"""
from pydantic import BaseModel, Field


class InsertionDBError(Exception):
    """Cannnot insert data into mysql"""


class testData(BaseModel):
    """test data"""

    name: str = Field(..., description="name")
