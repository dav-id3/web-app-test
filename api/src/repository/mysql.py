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
from src.schema import mysql as schema


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
    def register_test_data(self, session: Session, req: List[schema.testData]) -> None:
        """
        register test data

        Args:
            req(schema.testData): input data
        Returns:
            None
        """


class Repository(Interface):
    """class for dmysql repository"""

    def register_test_data(self, session: Session, req: List[schema.testData]) -> None:
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
        except sqlalchemy.exc.IntegrityError as err:
            session.rollback()
            raise schema.InsertionDBError("mysql.register_test_data")
