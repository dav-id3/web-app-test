"""base service"""
import re
from abc import ABCMeta, abstractmethod
from datetime import datetime
from typing import Final, List, Optional, Tuple
from sqlalchemy.orm import Session

import src.schema.repository.mysql as schema
from src.repository.mysql import Interface as repository
from src.configuration import const


class Interface(metaclass=ABCMeta):
    """class for base interface"""

    def __call__(self):
        return self

    @abstractmethod
    def test(self, db: Session, rep: repository):
        """
        test method
        Args:
            None
        Returns:
            None
        """


class Service(Interface):
    """class for base service"""

    def test(self, db: Session, rep: repository, req: List[schema.testData]):
        rep.register_test_data(db, req)
