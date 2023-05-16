"""base service"""
import re
from abc import ABCMeta, abstractmethod
from datetime import datetime
from typing import Final, List, Optional, Tuple
from sqlalchemy.orm import Session
from collections import defaultdict

import src.schema.repository.mysql as mysqlschema
import src.schema.service.category as svcschema
from src.repository.mysql import Interface as repository
from src.configuration import const


class Interface(metaclass=ABCMeta):
    """class for category service interface"""

    def __call__(self):
        return self

    @abstractmethod
    def get_subcategories(self, db: Session, rep: repository) -> List[svcschema.subcategories]:
        """
        retrieve all categories with their subcategories as a list
        Args:
          None
        Returns:
          List[svcshema.subcategories]: all categories with lists of their subcategories
        """

    @abstractmethod
    def post_new_category(self, db: Session, rep: repository, req: svcschema.category) -> None:
        """
        post new category
        Args:
          req (svcschema.category): requested new category
        Returns:
          None
        """

    @abstractmethod
    def post_new_subcategory(self, db: Session, rep: repository, req: svcschema.subcategory) -> None:
        """
        post new subcategory
        Args:
          req (svcschema.subcategory): requested new subcategory
        Returns:
          None
        """

    @abstractmethod
    def update_category(self, db: Session, rep: repository, req: svcschema.category) -> None:
        """
        update category
        Args:
          req (svcschema.category): request data
        Returns:
          None
        """

    @abstractmethod
    def update_subcategory(self, db: Session, rep: repository, req: svcschema.subcategory) -> None:
        """
        update subcategory
        Args:
          req (svcschema.subcategory): request data
        Returns:
          None
        """


class Service(Interface):
    """class for category service"""

    def get_subcategories(self, db: Session, rep: repository) -> List[svcschema.subcategories]:
        """get all subcategories"""
        subcategories = rep.get_subcategories(db)
        categories = rep.get_categories(db)

        res_subcategories: List[svcschema.subcategories] = []
        for category in categories:
            res_subcategories.append(
                svcschema.subcategories(
                    category_id=category.id,
                    category=category.category,
                    subcategories=[
                        subcategory for subcategory in subcategories if subcategory.category_id == category.id
                    ],
                )
            )
        print(subcategories)
        return res_subcategories

    def post_new_category(self, db: Session, rep: repository, req: svcschema.category) -> None:
        """post new category or subcategory"""

        rep.update_category(
            db,
            svcschema.category(
                category_id=0,
                category_name=req.category,
            ),
        )

    def post_new_subcategory(self, db: Session, rep: repository, req: svcschema.subcategory) -> None:
        """post new category or subcategory"""

        rep.update_subcategory(
            db,
            svcschema.subcategory(
                subcategory_id=0,
                category_id=req.category_id,
                subcategory_name=req.subcategory,
            ),
        )

    def update_category(self, db: Session, rep: repository, req: svcschema.category) -> None:
        rep.update_category(db, req)

    def update_subcategory(self, db: Session, rep: repository, req: svcschema.subcategory) -> None:
        rep.update_subcategory(db, req)
