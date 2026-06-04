import { NextResponse } from 'next/server';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'llama3';

export async function POST(request: Request) {
  try {
    const { experience_text } = await request.json();
    if (!experience_text) {
      return NextResponse.json({ error: 'Experience text is required' }, { status: 400 });
    }

    const prompt = `Rewrite this work experience bullet point to be more professional, using strong action verbs and quantifying achievements where possible. Provide only the improved text:\n\n${experience_text}`;

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
        const improved = data.response?.trim();
        if (improved) {
          return NextResponse.json({ improved_experience: improved });
        }
      }
    } catch (ollamaErr) {
      console.warn('Ollama API error, falling back:', ollamaErr);
    }

    // Heuristic Fallback replacing weak verbs
    let improved = experience_text;
    const replacements = [
      { regex: /\b(worked on|perform|did)\b/gi, replacement: 'Engineered and implemented' },
      { regex: /\b(helped|assisted)\b/gi, replacement: 'Collaborated with cross-functional teams to deliver' },
      { regex: /\b(managed|led)\b/gi, replacement: 'Spearheaded' },
      { regex: /\b(made|created)\b/gi, replacement: 'Designed and deployed' },
    ];

    for (const r of replacements) {
      improved = improved.replace(r.regex, r.replacement);
    }

    if (improved === experience_text) {
      improved = 'Spearheaded the development and ' + improved;
    }

    return NextResponse.json({ improved_experience: improved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
