from fastapi import APIRouter
from app.api.v1.endpoints import employees, attendance, dashboard

api_router = APIRouter()

api_router.include_router(employees.router, prefix="/employees")
api_router.include_router(attendance.router, prefix="/attendance")
api_router.include_router(dashboard.router, prefix="/dashboard")
