from .base import BaseMySQL, Base


class SubCategories(BaseMySQL, Base):
    """subcategories entity"""

    __tablename__ = "subcategories"
