from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from backend.database.session import get_db
from backend.auth.dependencies import get_current_active_user
from backend.models.user import User
from backend.services.resume_service import get_resume
from backend.services.pdf_service import export_resume

router = APIRouter(prefix="/export", tags=["PDF Export"])

@router.get("/pdf/{resume_id}")
def download_resume_pdf(
    resume_id: str,
    template_id: str = "modern",
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Export a specific resume as a downloadable A4 PDF document.
    """
    # 1. Fetch resume and validate ownership
    try:
        resume = get_resume(db=db, resume_id=resume_id, user_id=current_user.id)
    except Exception:
        raise HTTPException(status_code=404, detail="Resume not found")

    # 2. Serialize data (In a real scenario, eagerly load sections and format)
    resume_data = {
        "id": str(resume.id),
        "title": resume.title,
        # Mocking personal info for demonstration
        "personalInfo": {"name": current_user.email, "title": "Professional"}
    }
    
    # 3. Generate PDF bytes
    try:
        pdf_bytes = export_resume(resume_data=resume_data, template_id=template_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    # 4. Return as downloadable file
    filename = f"resume_{resume_id}.pdf"
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )
