from .base import BaseMySQL, Base


class Data(BaseMySQL, Base):
    """Data entity"""

    __tablename__ = "data"
