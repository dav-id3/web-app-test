from typing import Union
from urllib import response
from fastapi import (
    FastAPI,
    APIRouter,
    Depends,
    HTTPException,
    Response,
    status)
from fastapi.encoders import jsonable_encoder
from fastapi.responses import ORJSONResponse
from sqlalchemy.orm import Session
import dependency.injection as dep 
import src.service.base as service
import src.repository.mysql as repository


router=APIRouter(prefix='/base')

@router.put('', status_code=status.HTTP_201_CREATED)
async def post_data(
    *,
    db: Session = Depends(dep.mysqlrep.get_session),
    svc: service.Interface = Depends(dep.basesvc),
    rep: repository.Interface = Depends(dep.mysqlrep)
) -> Response:
    """snd point for test"""
    svc.test(db, rep)
