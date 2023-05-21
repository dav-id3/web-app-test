"""schema for mysql"""
from pydantic import BaseModel, Field
from typing import List


class subcategory(BaseModel):
    """subcategory data"""

    id: int = Field(..., description="sub category id")
    subcategory: str = Field(..., description="subcategory name", max_length=15)
    category_id: int = Field(..., description="category id")


class category(BaseModel):
    """category data"""

    id: int = Field(..., description="category id")
    category: str = Field(..., description="category name", max_length=15)


class subcategories(BaseModel):
    """subcategories with their catory"""

    category_id: int = Field(..., description="id")
    category: str = Field(..., description="category")
    subcategories: List[subcategory] = Field(..., description="list of sub_categories")
