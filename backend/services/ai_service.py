import httpx
import logging
import re

logger = logging.getLogger(__name__)

OLLAMA_API_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3" # Default local model

async def _call_ollama(prompt: str) -> str:
    """
    Core architecture for communicating with local Ollama instance.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                OLLAMA_API_URL,
                json={
                    "model": MODEL_NAME,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=5.0
            )
            response.raise_for_status()
            data = response.json()
            return data.get("response", "").strip()
    except Exception as e:
        logger.warning(f"Ollama API connection error: {str(e)}. Using fallback.")
        return ""

async def improve_summary(current_summary: str, role: str) -> str:
    """
    Enhance the professional summary.
    """
    prompt = f"Rewrite and improve the following professional summary for a {role} role to be more impactful and concise. Do not include any conversational text, just the summary:\n\n{current_summary}"
    result = await _call_ollama(prompt)
    if result:
        return result
        
    # Local fallback
    words = current_summary.split()
    if len(words) < 5:
        return f"Results-oriented {role} professional with a solid foundation in core technical domains. Eager to contribute technical skills and collaborate on impactful projects."
    return f"Results-oriented {role} professional. {current_summary.strip()} Proven ability to apply technical skills to solve complex problems and collaborate effectively."

async def improve_experience(experience_text: str) -> str:
    """
    Rewrite experience bullet points to use action verbs and highlight achievements.
    """
    prompt = f"Rewrite this work experience bullet point to be more professional, using strong action verbs and quantifying achievements where possible. Provide only the improved text:\n\n{experience_text}"
    result = await _call_ollama(prompt)
    if result:
        return result
        
    # Local fallback
    replacements = {
        r"\b(worked on|perform|did)\b": "Engineered and implemented",
        r"\b(helped|assisted)\b": "Collaborated with cross-functional teams to deliver",
        r"\b(managed|led)\b": "Spearheaded",
        r"\b(made|created)\b": "Designed and deployed",
    }
    improved = experience_text
    for pattern, repl in replacements.items():
        improved = re.sub(pattern, repl, improved, flags=re.IGNORECASE)
    if improved == experience_text:
        improved = "Spearheaded the development and " + improved
    return improved

async def suggest_skills(job_title: str, current_skills: list[str] = None) -> list[str]:
    """
    Suggest relevant skills based on job title and existing skills.
    """
    current = ", ".join(current_skills) if current_skills else "None"
    prompt = f"Given the job title '{job_title}' and current skills ({current}), suggest 5 additional highly relevant professional skills. Return them as a comma-separated list only."
    
    response = await _call_ollama(prompt)
    if response:
        skills = [s.strip() for s in response.split(",") if s.strip()]
        return skills
        
    # Local fallback
    common_skills = {
        "software": ["React", "TypeScript", "Node.js", "Git", "SQL"],
        "electronics": ["MATLAB", "LabVIEW", "Circuit Design", "Digital Logic", "Signal Processing"],
        "student": ["Problem Solving", "Teamwork", "Python", "Data Analysis", "Communication"]
    }
    job_lower = job_title.lower()
    for key, skills in common_skills.items():
        if key in job_lower:
            return [s for s in skills if s not in (current_skills or [])]
    return [s for s in common_skills["student"] if s not in (current_skills or [])]

async def optimize_for_ats(resume_content: str, job_description: str) -> dict:
    """
    Analyze resume against a job description for ATS optimization.
    """
    prompt = f"Analyze the following resume against the job description. Provide a keyword gap analysis and a match score (0-100).\n\nResume:\n{resume_content}\n\nJob Description:\n{job_description}"
    
    response = await _call_ollama(prompt)
    if response:
        # Try to parse match score from response if it mentions numbers
        score_match = re.search(r'score:\s*(\d+)|(\d+)\s*/\s*100|(\d+)%', response, re.IGNORECASE)
        score = int(score_match.group(1) or score_match.group(2) or score_match.group(3)) if score_match else 75
        return {
            "score": score,
            "missing_keywords": ["ATS optimization", "industry keywords"],
            "matching_keywords": ["experience"],
            "analysis": response
        }
        
    # Local fallback matching
    keywords = ["python", "javascript", "react", "typescript", "node", "sql", "matlab", 
                "labview", "c++", "c", "analog", "digital", "circuit", "control systems", 
                "communication", "signal processing", "aws", "docker", "git"]
    
    resume_lower = resume_content.lower()
    jd_lower = job_description.lower()
    
    found_in_jd = [kw for kw in keywords if re.search(r'\b' + re.escape(kw) + r'\b', jd_lower)]
    found_in_resume = [kw for kw in keywords if re.search(r'\b' + re.escape(kw) + r'\b', resume_lower)]
    
    missing = [kw for kw in found_in_jd if kw not in found_in_resume]
    matching = [kw for kw in found_in_jd if kw in found_in_resume]
    
    if not found_in_jd:
        score = 80
        missing = ["Circuit Design", "Signal Processing"]
    else:
        score = int((len(matching) / len(found_in_jd)) * 100)
        
    return {
        "score": max(35, min(score, 100)),
        "missing_keywords": missing,
        "matching_keywords": matching,
        "analysis": f"ATS Match Score: {score}%. Identified matching keywords: {', '.join(matching) if matching else 'None'}. Missing keywords: {', '.join(missing) if missing else 'None'}."
    }

async def parse_resume_text(text: str) -> dict:
    """
    Parse raw resume text into structured JSON schema.
    """
    prompt = f"Parse the following resume text into a structured JSON object. The JSON must exactly match this structure:\n{{\n  \"personalInfo\": {{\n    \"name\": \"\",\n    \"title\": \"\",\n    \"email\": \"\",\n    \"phone\": \"\",\n    \"location\": \"\",\n    \"github\": \"\",\n    \"linkedin\": \"\"\n  }},\n  \"summary\": \"\",\n  \"education\": [\n    {{\n      \"institution\": \"\",\n      \"degree\": \"\",\n      \"startDate\": \"\",\n      \"endDate\": \"\",\n      \"gpa\": \"\"\n    }}\n  ],\n  \"coursework\": [],\n  \"projects\": [\n    {{\n      \"title\": \"\",\n      \"technologies\": \"\",\n      \"description\": \"\"\n    }}\n  ],\n  \"skills\": [\n    {{\n      \"category\": \"\",\n      \"list\": []\n    }}\n  ]\n}}\n\nResume Text:\n{text}"
    
    response = await _call_ollama(prompt)
    if response:
        try:
            import json
            json_start = response.find("{")
            json_end = response.rfind("}") + 1
            if json_start >= 0 and json_end > json_start:
                return json.loads(response[json_start:json_end])
        except Exception:
            pass
            
    # Local fallback regex-based parsing
    personal_info = {
        "name": "", "title": "", "email": "", "phone": "", "location": "", "github": "", "linkedin": ""
    }
    
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    if email_match:
        personal_info["email"] = email_match.group(0)
        
    phone_match = re.search(r'\+?\d[\d-\s\(\)]{8,}\d', text)
    if phone_match:
        personal_info["phone"] = phone_match.group(0)
        
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if lines:
        personal_info["name"] = lines[0]
        
    sections = re.split(r'\b(education|experience|projects|coursework|skills|about me|summary)\b', text, flags=re.IGNORECASE)
    
    summary = ""
    education = []
    projects = []
    skills = []
    coursework = []
    
    for i in range(1, len(sections), 2):
        sec_name = sections[i].lower()
        sec_content = sections[i+1] if i+1 < len(sections) else ""
        
        if sec_name in ["summary", "about me"]:
            summary = sec_content.strip()
        elif sec_name == "education":
            edu_lines = [l.strip() for l in sec_content.split('\n') if l.strip()]
            for line in edu_lines[:3]:
                education.append({
                    "institution": line,
                    "degree": "Degree",
                    "startDate": "", "endDate": "", "gpa": ""
                })
        elif sec_name in ["experience", "projects"]:
            proj_lines = [l.strip() for l in sec_content.split('\n') if l.strip()]
            for line in proj_lines[:3]:
                projects.append({
                    "title": line[:50],
                    "technologies": "Tools",
                    "description": line
                })
        elif sec_name == "skills":
            skills_content = [s.strip() for s in sec_content.replace('\n', ',').split(',') if s.strip()]
            skills.append({
                "category": "Skills",
                "list": skills_content[:10]
            })
            
    return {
        "personalInfo": personal_info,
        "summary": summary,
        "education": education,
        "coursework": coursework,
        "projects": projects,
        "skills": skills
    }
