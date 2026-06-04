import { NextResponse } from 'next/server';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'llama3';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'Text content is required' }, { status: 400 });
    }

    const prompt = `Parse the following resume text into a structured JSON object. The JSON must exactly match this structure:
{
  "personalInfo": {
    "name": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "github": "",
    "linkedin": ""
  },
  "summary": "",
  "education": [
    {
      "institution": "",
      "degree": "",
      "startDate": "",
      "endDate": "",
      "gpa": ""
    }
  ],
  "coursework": [],
  "projects": [
    {
      "title": "",
      "technologies": "",
      "description": ""
    }
  ],
  "skills": [
    {
      "category": "",
      "list": []
    }
  ]
}

Resume Text:
${text}`;

    try {
      const response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL_NAME,
          prompt,
          stream: false,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        const responseText = data.response || '';
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}') + 1;
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          const parsed = JSON.parse(responseText.substring(jsonStart, jsonEnd));
          return NextResponse.json(parsed);
        }
      }
    } catch (ollamaErr) {
      console.warn('Ollama API error, falling back:', ollamaErr);
    }

    // Heuristic Fallback parser using regex
    const personalInfo = {
      name: '', title: '', email: '', phone: '', location: '', github: '', linkedin: ''
    };

    const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
    if (emailMatch) personalInfo.email = emailMatch[0];

    const phoneMatch = text.match(/\+?\d[\d-\s\(\)]{8,}\d/);
    if (phoneMatch) personalInfo.phone = phoneMatch[0];

    const lines = text.split('\n').map((l: string) => l.trim()).filter(Boolean);
    if (lines.length > 0) personalInfo.name = lines[0];

    const sections = text.split(/\b(education|experience|projects|coursework|skills|about me|summary)\b/i);
    let summary = '';
    const education: any[] = [];
    const projects: any[] = [];
    const skills: any[] = [];
    const coursework: string[] = [];

    for (let i = 1; i < sections.length; i += 2) {
      const secName = sections[i].toLowerCase();
      const secContent = sections[i + 1] || '';

      if (secName === 'summary' || secName === 'about me') {
        summary = secContent.trim();
      } else if (secName === 'education') {
        const eduLines = secContent.split('\n').map((l: string) => l.trim()).filter(Boolean);
        for (const line of eduLines.slice(0, 3)) {
          education.push({
            institution: line,
            degree: 'Degree',
            startDate: '', endDate: '', gpa: ''
          });
        }
      } else if (secName === 'experience' || secName === 'projects') {
        const projLines = secContent.split('\n').map((l: string) => l.trim()).filter(Boolean);
        for (const line of projLines.slice(0, 3)) {
          projects.push({
            title: line.substring(0, 50),
            technologies: 'Tools',
            description: line
          });
        }
      } else if (secName === 'skills') {
        const skillsContent = secContent.replace(/\n/g, ',').split(',').map((s: string) => s.trim()).filter(Boolean);
        skills.push({
          category: 'Skills',
          list: skillsContent.slice(0, 10)
        });
      }
    }

    return NextResponse.json({
      personalInfo,
      summary,
      education,
      coursework,
      projects,
      skills
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
