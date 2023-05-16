"""schema for mysql"""
from pydantic import BaseModel, Field


class InsertionDBError(Exception):
    """Cannnot insert data into mysql"""


class testData(BaseModel):
    """test data"""

    name: str = Field(..., description="name")


class record(BaseModel):
    """record data"""

    id: int = Field(..., description="id")
    name: str = Field(..., description="name")
    category: str = Field(..., description="category")
    sub_category: str = Field(..., description="sub_category")
    amount: int = Field(..., description="amount")
    description: str = Field(..., description="description")
    is_spending: bool = Field(..., description="is_spending")
    date: str = Field(..., description="date")


class subcategory(BaseModel):
    """subcategory data"""

    id: int = Field(..., description="id")
    sub_category: str = Field(..., description="sub_category")
    category_id: int = Field(..., description="id")


class category(BaseModel):
    """category data"""

    id: int = Field(..., description="id")
    category: str = Field(..., description="sub_category")
