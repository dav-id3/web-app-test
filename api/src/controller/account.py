from typing import Union
from urllib import response
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Response, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import ORJSONResponse
from sqlalchemy.orm import Session
from typing import List
import src.dependency.injection as dep
import src.service.account as service
import src.repository.mysql as repository
from src.schema.repository import mysql as schema

router = APIRouter(prefix="/account")


@router.get("/get", response_model=dict[str, List[schema.record]], status_code=status.HTTP_200_OK)
async def get_all_records(
    *,
    db: Session = Depends(dep.mysqlrep.get_session),
    svc: service.Interface = Depends(dep.accountsvc),
    rep: repository.Interface = Depends(dep.mysqlrep),
) -> Union[Response, List[schema.record]]:
    """get record"""
    return {"response": svc.get_all_records(db, rep)}


@router.post("/post", status_code=status.HTTP_201_CREATED)
async def post_record(
    req: List[schema.record],
    *,
    db: Session = Depends(dep.mysqlrep.get_session),
    svc: service.Interface = Depends(dep.accountsvc),
    rep: repository.Interface = Depends(dep.mysqlrep),
) -> Response:
    """post record"""
    svc.post_record(db, rep, req)
    return Response(status_code=status.HTTP_201_CREATED)


@router.put("/update", status_code=status.HTTP_202_ACCEPTED)
async def update_record(
    req: schema.record,
    *,
    db: Session = Depends(dep.mysqlrep.get_session),
    svc: service.Interface = Depends(dep.accountsvc),
    rep: repository.Interface = Depends(dep.mysqlrep),
) -> Response:
    """post record"""
    svc.update_record(db, rep, req)
    return Response(status_code=status.HTTP_202_ACCEPTED)


@router.delete("/delete/{deleted_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_record(
    deleted_id: int,
    *,
    db: Session = Depends(dep.mysqlrep.get_session),
    svc: service.Interface = Depends(dep.accountsvc),
    rep: repository.Interface = Depends(dep.mysqlrep),
) -> Response:
    """post record"""
    svc.delete_record(db, rep, deleted_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
