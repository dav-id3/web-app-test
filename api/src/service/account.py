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

    def is_same_record(self, record_a: schema.record, record_b: schema.record) -> bool:
        return (
            record_a.name == record_b.name
            and record_a.category_id == record_b.category_id
            and record_a.subcategory_id == record_b.subcategory_id
            and record_a.is_spending == record_b.is_spending
            and record_a.repeat_frequency == record_b.repeat_frequency
        )

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

    @abstractmethod
    def delete_repeatation(self, db: Session, rep: repository, deleted_id: int) -> None:
        """
        delete repeatation record to db
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

    def delete_repeatation(self, db: Session, rep: repository, deleted_id: int) -> None:
        records = rep.get_all_records(db)
        deleted_record = list(filter(lambda x: x.id == deleted_id, records))[0]

        for record in records:
            if self.is_same_record(record, deleted_record):
                record.repeat_frequency = None
                rep.update_record(db, record)
