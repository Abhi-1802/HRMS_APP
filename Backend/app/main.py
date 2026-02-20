# main.py
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.exceptions import http_exception_handler
from app.db.base import Base
from app.db.session import engine

# --- FastAPI app ---
app = FastAPI(title="HRMS Lite API")

# --- CORS setup ---
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Exception handlers ---
app.add_exception_handler(HTTPException, http_exception_handler)

# --- API routes ---
app.include_router(api_router, prefix="/api/v1")

# --- Simple root endpoint ---
@app.get("/")
def root():
    return {"message": "HRMS Lite Backend Running"}

# --- Health check for Railway ---
@app.get("/health")
def health():
    return {"status": "ok"}

# --- Safe DB initialization ---
@app.on_event("startup")
async def startup_event():
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")
    except Exception as e:
        print("DB init failed:", e)

# --- Run Uvicorn with dynamic PORT for Railway ---
if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))  # Railway sets this automatically
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)