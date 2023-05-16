from .base import BaseMySQL, Base


class Records(BaseMySQL, Base):
    """Data entity"""

    __tablename__ = "records"
