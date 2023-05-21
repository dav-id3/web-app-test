from typing import Union
from urllib import response
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Response, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import ORJSONResponse
from sqlalchemy.orm import Session
from typing import List
import src.dependency.injection as dep
import src.service.category as service
import src.repository.mysql as repository
from src.schema.service import category as svcschema

router = APIRouter(prefix="/category")


@router.get("/get", response_model=dict[str, List[svcschema.subcategories]], status_code=status.HTTP_200_OK)
async def get_subcategories(
    *,
    db: Session = Depends(dep.mysqlrep.get_session),
    svc: service.Interface = Depends(dep.categorysvc),
    rep: repository.Interface = Depends(dep.mysqlrep),
) -> Union[Response, List[dict]]:
    """get all subcategories"""
    return {"categories": svc.get_subcategories(db, rep)}


@router.post("/post/category", status_code=status.HTTP_201_CREATED)
async def post_new_category(
    req: svcschema.category,
    *,
    db: Session = Depends(dep.mysqlrep.get_session),
    svc: service.Interface = Depends(dep.categorysvc),
    rep: repository.Interface = Depends(dep.mysqlrep),
) -> Response:
    """post new category or subcategory"""
    svc.post_new_category(db, rep, req)
    return Response(status_code=status.HTTP_201_CREATED)


@router.post("/post/subcategory", status_code=status.HTTP_201_CREATED)
async def post_new_subcategory(
    req: svcschema.subcategory,
    *,
    db: Session = Depends(dep.mysqlrep.get_session),
    svc: service.Interface = Depends(dep.categorysvc),
    rep: repository.Interface = Depends(dep.mysqlrep),
) -> Response:
    """post new category or subcategory"""
    svc.post_new_subcategory(db, rep, req)
    return Response(status_code=status.HTTP_201_CREATED)


@router.put("/update/category", status_code=status.HTTP_202_ACCEPTED)
async def update_category(
    req: svcschema.category,
    *,
    db: Session = Depends(dep.mysqlrep.get_session),
    svc: service.Interface = Depends(dep.categorysvc),
    rep: repository.Interface = Depends(dep.mysqlrep),
) -> Response:
    """update category"""
    svc.update_category(db, rep, req)
    return Response(status_code=status.HTTP_202_ACCEPTED)


@router.put("/update/subcategory", status_code=status.HTTP_202_ACCEPTED)
async def update_subcategory(
    req: svcschema.subcategory,
    *,
    db: Session = Depends(dep.mysqlrep.get_session),
    svc: service.Interface = Depends(dep.categorysvc),
    rep: repository.Interface = Depends(dep.mysqlrep),
) -> Response:
    """update subcategory"""
    svc.update_subcategory(db, rep, req)
    return Response(status_code=status.HTTP_202_ACCEPTED)


@router.delete("/delete/category/{deleted_id}", status_code=status.HTTP_202_ACCEPTED)
async def delete_category(
    deleted_id: int,
    *,
    db: Session = Depends(dep.mysqlrep.get_session),
    svc: service.Interface = Depends(dep.categorysvc),
    rep: repository.Interface = Depends(dep.mysqlrep),
) -> Response:
    """delete category"""

    subcategories_list = svc.get_subcategories(db, rep)
    for subcategories in subcategories_list:
        if subcategories.category_id == deleted_id:
            for subcategory in subcategories.subcategories:
                print(subcategory)
                svc.delete_subcategory(db, rep, subcategory.id)

    svc.delete_category(db, rep, deleted_id)

    return Response(status_code=status.HTTP_202_ACCEPTED)


@router.delete("/delete/subcategory/{deleted_id}", status_code=status.HTTP_202_ACCEPTED)
async def delete_subcategory(
    deleted_id: int,
    *,
    db: Session = Depends(dep.mysqlrep.get_session),
    svc: service.Interface = Depends(dep.categorysvc),
    rep: repository.Interface = Depends(dep.mysqlrep),
) -> Response:
    """delete subcategory"""
    svc.delete_subcategory(db, rep, deleted_id)
    return Response(status_code=status.HTTP_202_ACCEPTED)
