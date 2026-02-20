# HRMS Lite Application

## 📌 Project Overview
HRMS Lite is a lightweight Human Resource Management System that allows an admin to manage employee records and track daily attendance.

## 🚀 Features

### Core
- Add, view, delete employees
- Mark attendance (Present/Absent)
- View attendance records

### Bonus
- Filter attendance by date
- Total present days per employee
- Dashboard summary
- Employee attendance summary

## 🛠️ Tech Stack

Backend:
- FastAPI
- MySQL
- SQLAlchemy

Frontend:
- React
- Tailwind CSS

Deployment:
- Backend: Render
- Database: MySQL

## ⚙️ Run Locally
First create and activate venv

### Backend

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
