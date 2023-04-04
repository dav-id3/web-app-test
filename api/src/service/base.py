"""base service"""
import re
from abc import ABCMeta, abstractmethod
from datetime import datetime
from typing import Final, List, Optional, Tuple

import src.schema.mysql as mysqlschema
from src.repository.mysql import Interface as repository
from configuration import const

class Interface(metaclass=ABCMeta):
    """class for base interface"""
    
    def __call__(self):
        return self
    
    @abstractmethod
    def test(self, rep: repository):
        """
        test method
        Args:
            None
        Returns:
            None
        """

class Service(Interface):
    """class for base service"""
    
    def test(self, rep: repository):
        rep.update_test_data()