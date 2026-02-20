from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate


def create_employee(db: Session, data: EmployeeCreate):
    existing = db.query(Employee).filter(
        (Employee.employee_id == data.employee_id) |
        (Employee.email == data.email)
    ).first()

    if existing:
        raise HTTPException(400, "Employee ID or Email already exists")

    emp = Employee(**data.dict())
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp


def get_employees(db: Session):
    return db.query(Employee).all()

def delete_employee(db: Session, emp_id: int):
    # Use Session.get() to fetch by primary key
    emp = db.get(Employee, emp_id)
    
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.delete(emp)
    db.commit()
    
    return {"message": f"Employee with id {emp_id} deleted successfully"}
