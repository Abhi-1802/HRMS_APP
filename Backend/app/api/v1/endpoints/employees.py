from sqlalchemy import func
from app.models.attendance import Attendance, StatusEnum
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.employee import EmployeeCreate
from app.services import employee_service

router = APIRouter()


@router.post("/")
def create_employee(data: EmployeeCreate, db: Session = Depends(get_db)):
    return employee_service.create_employee(db, data)


@router.get("/")
def list_employees(db: Session = Depends(get_db)):
    return employee_service.get_employees(db)


@router.delete("/{emp_id}")
def delete_employee(emp_id: int, db: Session = Depends(get_db)):
    employee_service.delete_employee(db, emp_id)
    return {"message": "Employee deleted"}



@router.get("/{emp_id}/summary")
def employee_summary(emp_id: int, db: Session = Depends(get_db)):
    present_days = (
        db.query(func.count(Attendance.id))
        .filter(
            Attendance.employee_id == emp_id,
            Attendance.status == StatusEnum.present,
        )
        .scalar()
    )

    absent_days = (
        db.query(func.count(Attendance.id))
        .filter(
            Attendance.employee_id == emp_id,
            Attendance.status == StatusEnum.absent,
        )
        .scalar()
    )

    return {
        "employee_id": emp_id,
        "present_days": present_days,
        "absent_days": absent_days,
    }
