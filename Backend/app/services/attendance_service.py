from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy import func
from datetime import date

from app.models.attendance import Attendance, StatusEnum
from app.schemas.attendance import AttendanceCreate
from app.models.employee import Employee


def mark_attendance(db: Session, data: AttendanceCreate):
    record = Attendance(**data.dict())
    employee = db.query(Employee).get(data.employee_id)
    if not employee:
        raise HTTPException(404, "Employee not found")    
    try:
        db.add(record)
        db.commit()
        db.refresh(record)
    except Exception:
        db.rollback()
        raise HTTPException(400, "Attendance already marked for this date")

    return record


# ✅ Filter attendance by employee + optional date range
def get_attendance_filtered(
    db: Session,
    emp_id: int,
    start_date: date | None = None,
    end_date: date | None = None,
):
    query = db.query(Attendance).filter(Attendance.employee_id == emp_id)

    if start_date:
        query = query.filter(Attendance.date >= start_date)

    if end_date:
        query = query.filter(Attendance.date <= end_date)

    return query.order_by(Attendance.date.desc()).all()


# ✅ Total present days per employee
def get_total_present_days(db: Session, emp_id: int):
    count = (
        db.query(func.count(Attendance.id))
        .filter(
            Attendance.employee_id == emp_id,
            Attendance.status == StatusEnum.present,
        )
        .scalar()
    )

    return {"employee_id": emp_id, "present_days": count}
