from .base import BaseMySQL, Base


class Categories(BaseMySQL, Base):
    """categories entity"""

    __tablename__ = "categories"
