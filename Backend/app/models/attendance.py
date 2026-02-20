from sqlalchemy import Column, Integer, Date, Enum, ForeignKey, UniqueConstraint
from app.db.base import Base
import enum


class StatusEnum(str, enum.Enum):
    present = "Present"
    absent = "Absent"


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    date = Column(Date, nullable=False)
    status = Column(Enum(StatusEnum), nullable=False)

    __table_args__ = (
        UniqueConstraint("employee_id", "date", name="unique_attendance"),
    )
