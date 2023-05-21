"""mysql repository"""
import textwrap
from abc import ABCMeta, abstractmethod
from typing import AsyncGenerator, List, Dict

import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.sql import text

import src.model as model
from src.configuration.env import ENV
from src.schema.repository import mysql as mysqlschema
from src.schema.service import category as categoryschema


class Interface(metaclass=ABCMeta):
    """class for mysql interface"""

    def __call__(self):
        return self

    def __init__(self, env: ENV):
        self.env = env
        self.engine = create_engine(self.__build_database_url(), pool_pre_ping=True)
        self.session = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

    async def get_session(self) -> AsyncGenerator:
        """dependent db session creation"""
        session = self.session()

        try:
            yield session
        finally:
            session.close()

    def __build_database_url(self) -> str:
        """
        build Python MySQL driver specific database url string

        Returns:
            str: database uri string
        Examples:
            >>> build_url()
            "mysql+mysqldb://username:password@hostname:port?charset=utf8"
        """
        hostname = self.env.MYSQL_HOST
        username = self.env.MYSQL_USER
        password = self.env.MYSQL_PASSWORD
        database = self.env.MYSQL_DATABASE
        port = self.env.MYSQL_PORT

        protocol = "mysql+mysqldb"
        identity = f"{username}:{password}"
        host = f"{hostname}:{port}"

        pathname = f"/{database}"
        qs = "?charset=utf8"

        origin = f"{protocol}://{identity}@{host}"

        return origin + pathname + qs

    @abstractmethod
    def register_test_data(self, session: Session, req: List[mysqlschema.testData]) -> None:
        """
        register test data

        Args:
            req(mysqlschema.testData): input data
        Returns:
            None
        """

    @abstractmethod
    def get_all_records(self, session: Session) -> List[mysqlschema.record]:
        """
        get all records

        Args:
            None
        Returns:
            List[mysqlschema.record]: all records
        """

    @abstractmethod
    def post_record(self, session: Session, req: List[mysqlschema.record]) -> None:
        """
        post record

        Args:
            req (List[mysqlschema.record]): records
        Returns:
            None
        """

    @abstractmethod
    def update_record(self, session: Session, req: mysqlschema.record) -> None:
        """
        update record

        Args:
            req (mysqlschema.record): record
        Returns:
            None
        """

    @abstractmethod
    def delete_record(self, session: Session, deleted_id: int) -> None:
        """
        delete record

        Args:
            deleted_id (int): id of deleted record data
        Returns:
            None
        """

    @abstractmethod
    def get_subcategories(self, session: Session) -> List[categoryschema.subcategory]:
        """
        get subcategories

        Args:
            None
        Returns:
            List[mysqlschema.subcategory]: subcategories
        """

    @abstractmethod
    def get_categories(self, session: Session) -> List[categoryschema.category]:
        """
        get categories

        Args:
            None
        Returns:
            List[mysqlschema.subcategories]: categories
        """

    @abstractmethod
    def update_category(self, session: Session, req: categoryschema.category) -> None:
        """
        update category

        Args:
            req (categoryschema.category): category
        Returns:
            None
        """

    @abstractmethod
    def update_subcategory(self, session: Session, req: categoryschema.subcategory) -> None:
        """
        update subcategory

        Args:
            req (categoryschema.subcategory): subcategory
        Returns:
            None
        """

    @abstractmethod
    def delete_category(self, session: Session, deleted_id: int) -> None:
        """
        delete category

        Args:
            deleted_id (int): id of deleted category data
        Returns:
            None
        """

    @abstractmethod
    def delete_subcategory(self, session: Session, deleted_id: int) -> None:
        """
        delete subcategory

        Args:
            deleted_id (int): id of deleted subcategory data
        Returns:
            None
        """


class Repository(Interface):
    """class for dmysql repository"""

    def register_test_data(self, session: Session, req: List[mysqlschema.testData]) -> None:
        sql = textwrap.dedent(
            f"""
            INSERT INTO
                {model.Data.__tablename__}
                (
                    `id`,
                    `name`
                )
            VALUES
                (
                    :id,
                    :name
                )
            ON DUPLICATE KEY UPDATE
                `name` = VALUES (`name`)
            """
        )
        prepared_statement: List[Dict[str, any]] = []
        for r in req:
            state_dict = {}
            state_dict["id"] = 0
            state_dict["name"] = r.name
            prepared_statement.append(state_dict)
        try:
            session.execute(text(sql), prepared_statement)
            session.commit()
        except sqlalchemy.exc.IntegrityError:
            session.rollback()
            raise mysqlschema.InsertionDBError("mysql.register_test_data")

    def get_all_records(self, session: Session) -> List[mysqlschema.record]:
        sql = textwrap.dedent(
            f"""
            SELECT
                `id`,
                `name`,
                `category_id`,
                `subcategory_id`,
                `amount`,
                `description`,
                `is_spending`,
                `date`
            FROM {model.Records.__tablename__}
            """
        )
        try:
            result = session.execute(text(sql))
            session.commit()
            return [mysqlschema.record(**dict(row)) for row in result]
        except sqlalchemy.exc.IntegrityError:
            session.rollback()
            raise mysqlschema.SelectionDBError("mysql.get_all_records")

    def post_record(self, session: Session, req: List[mysqlschema.record]) -> None:
        sql = textwrap.dedent(
            f"""
            INSERT INTO
                {model.Records.__tablename__}
                (
                    `id`,
                    `name`,
                    `category_id`,
                    `subcategory_id`,
                    `amount`,
                    `description`,
                    `is_spending`,
                    `date`
                )
            VALUES
                (
                    :id,
                    :name,
                    :category_id,
                    :subcategory_id,
                    :amount,
                    :description,
                    :is_spending,
                    :date
                )
            ON DUPLICATE KEY UPDATE
                `name` = VALUES (`name`),
                `category_id` = VALUES (`category_id`),
                `subcategory_id` = VALUES (`subcategory_id`),
                `amount` = VALUES (`amount`),
                `description` = VALUES (`description`),
                `is_spending` = VALUES (`is_spending`),
                `date` = VALUES (`date`)
            """
        )
        prepared_statement: List[Dict[str, any]] = []
        for r in req:
            state_dict = {}
            state_dict["id"] = 0
            state_dict["name"] = r.name
            state_dict["category_id"] = r.category_id
            state_dict["subcategory_id"] = r.subcategory_id
            state_dict["amount"] = r.amount
            state_dict["description"] = r.description
            state_dict["is_spending"] = r.is_spending
            state_dict["date"] = r.date
            prepared_statement.append(state_dict)
        try:
            session.execute(text(sql), prepared_statement)
            session.commit()
        except sqlalchemy.exc.IntegrityError:
            session.rollback()
            raise mysqlschema.InsertionDBError("mysql.post_record")

    def update_record(self, session: Session, req: mysqlschema.record) -> None:
        sql = textwrap.dedent(
            f"""
            INSERT INTO
                {model.Records.__tablename__}
                (
                    `id`,
                    `name`,
                    `category_id`,
                    `subcategory_id`,
                    `amount`,
                    `description`,
                    `is_spending`,
                    `date`
                )
            VALUES
                (
                    :id,
                    :name,
                    :category_id,
                    :subcategory_id,
                    :amount,
                    :description,
                    :is_spending,
                    :date
                )
            ON DUPLICATE KEY UPDATE
                `name` = VALUES (`name`),
                `category_id` = VALUES (`category_id`),
                `subcategory_id` = VALUES (`subcategory_id`),
                `amount` = VALUES (`amount`),
                `description` = VALUES (`description`),
                `is_spending` = VALUES (`is_spending`),
                `date` = VALUES (`date`)
            """
        )
        prepared_statement: List[Dict[str, any]] = []
        state_dict = {}
        state_dict["id"] = req.id
        state_dict["name"] = req.name
        state_dict["category_id"] = req.category_id
        state_dict["subcategory_id"] = req.subcategory_id
        state_dict["amount"] = req.amount
        state_dict["description"] = req.description
        state_dict["is_spending"] = req.is_spending
        state_dict["date"] = req.date
        prepared_statement.append(state_dict)

        try:
            session.execute(text(sql), prepared_statement)
            session.commit()
        except sqlalchemy.exc.IntegrityError:
            session.rollback()
            raise mysqlschema.InsertionDBError("mysql.update_record")

    def delete_record(self, session: Session, deleted_id: int) -> None:
        sql = textwrap.dedent(
            f"""
            DELETE FROM
                {model.Records.__tablename__}
            WHERE
                id = {deleted_id}
            """
        )
        try:
            session.execute(text(sql))
            session.commit()
        except sqlalchemy.exc.IntegrityError:
            session.rollback()
            raise mysqlschema.InsertionDBError("mysql.delete_record")

    def get_categories(self, session: Session) -> List[categoryschema.category]:
        sql = textwrap.dedent(
            f"""
            SELECT
                `id`,
                `category`
            FROM {model.Categories.__tablename__}
            """
        )
        try:
            result = session.execute(text(sql))
            session.commit()
            return [categoryschema.category(**dict(row)) for row in result]
        except sqlalchemy.exc.IntegrityError:
            session.rollback()
            raise mysqlschema.SelectionDBError("mysql.get_categories")

    def get_subcategories(self, session: Session) -> List[categoryschema.subcategory]:
        sql = textwrap.dedent(
            f"""
            SELECT
                `id`,
                `subcategory`,
                `category_id`
            FROM {model.SubCategories.__tablename__}
            """
        )
        try:
            result = session.execute(text(sql))
            session.commit()
            return [categoryschema.subcategory(**dict(row)) for row in result]
        except sqlalchemy.exc.IntegrityError:
            session.rollback()
            raise mysqlschema.SelectionDBError("mysql.get_subcategories")

    def update_category(self, session: Session, req: categoryschema.category) -> None:
        sql = textwrap.dedent(
            f"""
            INSERT INTO
                {model.Categories.__tablename__}
                (
                    `id`,
                    `category`
                )
            VALUES
                (
                    {req.id},
                    '{req.category}'
                )
            ON DUPLICATE KEY UPDATE
                `category` = VALUES (`category`)
            """
        )

        try:
            session.execute(text(sql))
            session.commit()
        except sqlalchemy.exc.IntegrityError:
            session.rollback()
            raise mysqlschema.InsertionDBError("mysql.update_category")

    def update_subcategory(self, session: Session, req: categoryschema.subcategory) -> None:
        sql = textwrap.dedent(
            f"""
            INSERT INTO
                {model.SubCategories.__tablename__}
                (
                    `id`,
                    `subcategory`,
                    `category_id`
                )
            VALUES
                (
                    {req.id},
                    '{req.subcategory}',
                    {req.category_id}
                )
            ON DUPLICATE KEY UPDATE
                `subcategory` = VALUES (`subcategory`),
                `category_id` = VALUES (`category_id`)
            """
        )

        try:
            session.execute(text(sql))
            session.commit()
        except sqlalchemy.exc.IntegrityError:
            session.rollback()
            raise mysqlschema.InsertionDBError("mysql.update_subcategory")

    def delete_category(self, session: Session, deleted_id: int) -> None:
        sql = textwrap.dedent(
            f"""
            DELETE FROM
                {model.Categories.__tablename__}
            WHERE
                id = {deleted_id}
            """
        )
        try:
            session.execute(text(sql))
            session.commit()
        except sqlalchemy.exc.IntegrityError:
            session.rollback()
            raise mysqlschema.InsertionDBError("mysql.delete_category")

    def delete_subcategory(self, session: Session, deleted_id: int) -> None:
        sql = textwrap.dedent(
            f"""
            DELETE FROM
                {model.SubCategories.__tablename__}
            WHERE
                id = {deleted_id}
            """
        )
        try:
            session.execute(text(sql))
            session.commit()
        except sqlalchemy.exc.IntegrityError:
            session.rollback()
            raise mysqlschema.InsertionDBError("mysql.delete_subcategory")
