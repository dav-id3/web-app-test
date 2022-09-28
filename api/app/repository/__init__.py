from typing import Any
from abc import ABCMeta, abstractmethod
from dataclasses import make_dataclass
from unittest import result
from urllib import response

from sqlalchemy import create_engine
from sqlalchemy.orm import Session


import app.configuration.defined_type as dt
import app.schema.error as err_schema
import app.schema.repository.data as schema
import app.schema.service.data as data_svc_schema
from app import model
from app.configuration import ENV

#repository interface
class DataFromDBRepInterface(metaclass=ABCMeta):
    def __init__(self, env: ENV):
        self.env = env

    def __call__(self):
        return self

    @abstractmethod
    def get_data_by_id(
        self, db: Session, id: dt.id
    ) -> data_svc_schema.DataList:

#repository class
class DataFromDBRepository(DataFromDBRepInterface):
    def get_data_by_id(self, db: Session, id: dt.id):
        responses = (
            db.query(model.DATA)
            .filter(model.DATA.id == id)
            .all()
        )
        result = schema.DataListFromDB(
            data_list=[
                schema.DataListFromDB(**r.to_dict())
                for r in responses
            ]
        )
        try:
            return result.convert_to_data_svc_schema()
        except err_schema.NoDataError as err:
            raise err



