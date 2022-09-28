from typing import Union
from urllib import response
from fastapi import (
    FastAPI,
    APIRouter,
    Depends,
    File,
    HTTPException,
    Response,
    UploadFile,
    status)
from fastapi.encoders import jsonable_encoder
from fastapi.responses import ORJSONResponse
from sqlalchemy.orm import Session



router=APIRouter(prefix='/data')

@router.post('', status_code=status.HTTP_201_CREATED)
async def post_data(
    file: UploadFile = File(...),
    *,
    db: Session = Depends(get_session)
    svc: Data2DBsvc = Depends(di)
    rep: Data2DBrep = Depends(di)
) -> Response:
