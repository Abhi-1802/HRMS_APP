from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.db.base import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(50), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    department = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
