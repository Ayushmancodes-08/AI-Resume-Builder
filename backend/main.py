from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.auth.routes import router as auth_router
from backend.api.resume import router as resume_router
from backend.api.resume_section import router as resume_section_router
from backend.api.ai import router as ai_router
from backend.api.pdf import router as pdf_router
from backend.core.exceptions import setup_exception_handlers
from backend.database.init_db import init_db

# Initialize database tables
init_db()

app = FastAPI(
    title="AI Resume Builder API",
    description="Backend API for AI Resume Builder",
    version="1.0.0"
)

import os

# CORS middleware configuration
allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "*")
if allowed_origins_raw == "*":
    origins = ["*"]
else:
    origins = [origin.strip() for origin in allowed_origins_raw.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["Authentication"]
)
app.include_router(
    resume_router,
    prefix="/api/v1/resumes",
    tags=["Resumes"]
)
app.include_router(
    resume_section_router,
    prefix="/api/v1",
)
app.include_router(
    ai_router,
    prefix="/api/v1",
)
app.include_router(
    pdf_router,
    prefix="/api/v1",
)

# Setup exception handlers
setup_exception_handlers(app)

@app.get("/health", tags=["Health Check"])
def health_check():
    """
    Health check endpoint to verify the API is running.
    """
    return {"status": "ok", "message": "API is healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
