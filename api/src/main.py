"""Application main entrypoint"""
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from src.configuration import const
from src.controller.base import router as base_router
from src.dependency.injection import env

# test routers
test_router = APIRouter(prefix="/base")
test_router.include_router(base_router)

# Application
app = FastAPI(title=const.PROJECT_NAME, version=const.PROJECT_VERSION)
app.include_router(test_router, tags=["test"])

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=env.ALLOW_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
