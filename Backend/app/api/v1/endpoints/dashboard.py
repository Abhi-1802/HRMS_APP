from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.deps import get_db
from app.models.employee import Employee
from app.models.attendance import Attendance, StatusEnum

router = APIRouter()


@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    total_employees = db.query(func.count(Employee.id)).scalar()

    total_attendance = db.query(func.count(Attendance.id)).scalar()

    total_present = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.status == StatusEnum.present)
        .scalar()
    )

    total_absent = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.status == StatusEnum.absent)
        .scalar()
    )

    return {
        "total_employees": total_employees,
        "attendance_records": total_attendance,
        "total_present": total_present,
        "total_absent": total_absent,
    }
