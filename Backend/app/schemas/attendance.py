from pydantic import BaseModel
from datetime import date


class AttendanceCreate(BaseModel):
    employee_id: int
    date: date
    status: str


class AttendanceOut(BaseModel):
    id: int
    employee_id: int
    date: date
    status: str

    class Config:
        orm_mode = True
