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
    """class for account interface"""

    def __call__(self):
        return self

    @abstractmethod
    def get_all_records(self, db: Session, rep: repository) -> List[schema.record]:
        """
        retrieve all records from db
        Args:
          None
        Returns:
          List[schema.record]: all records
        """

    @abstractmethod
    def post_record(self, db: Session, rep: repository, req: List[schema.record]) -> None:
        """
        post record to db
        Args:
          req (schema.record): record data
        Returns:
          None
        """

    @abstractmethod
    def update_record(self, db: Session, rep: repository, req: schema.record) -> None:
        """
        update record to db
        Args:
          req (schema.record): record data
        Returns:
          None
        """

    @abstractmethod
    def delete_record(self, db: Session, rep: repository, deleted_id: int) -> None:
        """
        delete record to db
        Args:
          deleted_id (int): id of deleted record data
        Returns:
          None
        """


class Service(Interface):
    """class for account service"""

    def get_all_records(self, db: Session, rep: repository) -> List[schema.record]:
        return rep.get_all_records(db)

    def post_record(self, db: Session, rep: repository, req: list[schema.record]) -> None:
        rep.post_record(db, req)

    def update_record(self, db: Session, rep: repository, req: schema.record) -> None:
        rep.update_record(db, req)

    def delete_record(self, db: Session, rep: repository, deleted_id: int) -> None:
        rep.delete_record(db, deleted_id)
