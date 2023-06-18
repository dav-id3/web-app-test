from typing import Union
from urllib import response
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Response, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import ORJSONResponse
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from collections import defaultdict
import calendar
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

    # 取得日がDB内regular recordの次の生成予定日以上の場合、new regular recordを作成する
    # frontend側でregular recordの登録の際に名前とsubcategory_idのユニーク判定を行う->これは依存関係がよくない
    # backendがregular recordを作成する際に、同じ名前とsubcategory_idのregular recordが存在するか確認してupdate setにすることでユニーク性を担保する
    records = svc.get_all_records(db, rep)
    record_dict: dict[schema.record] = dict()
    for record in records:
        if record.repeat_frequency is not None:
            if record_dict.get((record.name, record.subcategory_id, record.repeat_frequency), None) is not None:
                if datetime.strptime(record.date, "%Y-%m-%d") >= datetime.strptime(
                    record_dict[(record.name, record.subcategory_id, record.repeat_frequency)].date, "%Y-%m-%d"
                ):
                    record_dict[(record.name, record.subcategory_id, record.repeat_frequency)] = record
            else:
                record_dict[(record.name, record.subcategory_id, record.repeat_frequency)] = record

    today = datetime.today()
    for record in record_dict.values():
        if record.repeat_frequency is not None:
            record_date = datetime.strptime(record.date, "%Y-%m-%d")
            if record.repeat_frequency == "daily":
                for i in range(1, (today - record_date).days + 1):
                    if record_date + timedelta(days=i) <= today:
                        svc.post_record(
                            db,
                            rep,
                            [
                                schema.record(
                                    id=0,
                                    name=record.name,
                                    category_id=record.category_id,
                                    subcategory_id=record.subcategory_id,
                                    amount=record.amount,
                                    description=record.description,
                                    is_spending=record.is_spending,
                                    repeat_frequency=record.repeat_frequency,
                                    date=(record_date + timedelta(days=i)).strftime("%Y-%m-%d"),
                                    is_deleted=record.is_deleted,
                                )
                            ],
                        )
            elif record.repeat_frequency == "weekly":
                for i in range(1, (today - record_date).days // 7 + 1):
                    if record_date + timedelta(days=i * 7) <= today:
                        svc.post_record(
                            db,
                            rep,
                            [
                                schema.record(
                                    id=0,
                                    name=record.name,
                                    category_id=record.category_id,
                                    subcategory_id=record.subcategory_id,
                                    amount=record.amount,
                                    description=record.description,
                                    is_spending=record.is_spending,
                                    repeat_frequency=record.repeat_frequency,
                                    date=(record_date + timedelta(days=i * 7)).strftime("%Y-%m-%d"),
                                    is_deleted=record.is_deleted,
                                )
                            ],
                        )
            elif record.repeat_frequency == "monthly":
                for i in range(1, 13):
                    if record_date.month + i >= 13:
                        compared_month = record_date.month + i - 12
                        compared_year = record_date.year + 1
                    else:
                        compared_month = record_date.month + i
                        compared_year = record_date.year
                    if record_date.day >= calendar.monthrange(compared_year, compared_month)[1]:
                        saved_day = calendar.monthrange(compared_year, compared_month)[1]
                    else:
                        saved_day = record_date.day

                    if (compared_month < today.month and compared_year <= today.year) or (
                        compared_month == today.month and compared_year <= today.year and saved_day <= today.day
                    ):
                        svc.post_record(
                            db,
                            rep,
                            [
                                schema.record(
                                    id=0,
                                    name=record.name,
                                    category_id=record.category_id,
                                    subcategory_id=record.subcategory_id,
                                    amount=record.amount,
                                    description=record.description,
                                    is_spending=record.is_spending,
                                    repeat_frequency=record.repeat_frequency,
                                    date=f"{compared_year}-{('0' + str(compared_month))[-2:]}-{('0' + str(saved_day))[-2:]}",
                                    is_deleted=record.is_deleted,
                                )
                            ],
                        )
    res = list(filter(lambda x: not x.is_deleted, svc.get_all_records(db, rep)))
    res = sorted(res, key=lambda x: (datetime.strptime(x.date, "%Y-%m-%d"), -x.id), reverse=True)
    return {"response": res}


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
    """update record"""
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
    """delete record"""
    svc.delete_record(db, rep, deleted_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/delete_regular/{deleted_id}/{is_repeatation_deleted}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_regular_record(
    deleted_id: int,
    is_repeatation_deleted: bool,
    *,
    db: Session = Depends(dep.mysqlrep.get_session),
    svc: service.Interface = Depends(dep.accountsvc),
    rep: repository.Interface = Depends(dep.mysqlrep),
) -> Response:
    """delete regular record"""

    if not is_repeatation_deleted:
        svc.delete_record(db, rep, deleted_id)
    else:
        svc.delete_repeatation(db, rep, deleted_id)
        svc.delete_record(db, rep, deleted_id)

    return Response(status_code=status.HTTP_204_NO_CONTENT)
