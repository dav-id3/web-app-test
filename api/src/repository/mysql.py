"""mysql repository"""
import textwrap
from abc import ABCMeta, abstractmethod
from datetime import datetime
from typing import Any, AsyncGenerator, List, Tuple

import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.sql import text

import src.model as model
from src.configuration.env import ENV

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
        Builds Python MySQL DB driver spesific database url

        Returns:
            database url
        """
        url = 'mysql+mysqldb://'
        if self.env.MYSQL_USER is not None and self.env.MYSQL_PASSWORD is not None:
            url += f'{self.env.MYSQL_USER}:{self.env.MYSQL_PASSWORD}@'
            url += f'/{self.env.MYSQL_DATABASE}?charaset=utf8'

        return url
    
    @abstractmethod
    def update_test_data(self, session:Session) -> None:
        """
        Update test data

        Args:
            None
        Returns:
            None
        """
    
class Repository(Interface):
    """class for dmysql repository"""
    def update_test_data(self, session: Session) -> None:
        # update later
        return super().update_test_data(session)
        
