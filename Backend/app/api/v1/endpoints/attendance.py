from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date

from app.api.deps import get_db
from app.schemas.attendance import AttendanceCreate
from app.services import attendance_service

router = APIRouter()


@router.post("/")
def mark_attendance(data: AttendanceCreate, db: Session = Depends(get_db)):
    return attendance_service.mark_attendance(db, data)


# ✅ Filter by date range
@router.get("/{emp_id}")
def get_attendance(
    emp_id: int,
    start_date: date | None = Query(None),
    end_date: date | None = Query(None),
    db: Session = Depends(get_db),
):
    return attendance_service.get_attendance_filtered(
        db, emp_id, start_date, end_date
    )


# ✅ Total present days
@router.get("/{emp_id}/present-days")
def present_days(emp_id: int, db: Session = Depends(get_db)):
    return attendance_service.get_total_present_days(db, emp_id)
