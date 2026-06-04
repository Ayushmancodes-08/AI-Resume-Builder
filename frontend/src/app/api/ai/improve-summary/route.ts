import { NextResponse } from 'next/server';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'llama3';

export async function POST(request: Request) {
  try {
    const { summary, role } = await request.json();
    if (!summary) {
      return NextResponse.json({ error: 'Summary is required' }, { status: 400 });
    }

    const prompt = `Rewrite and improve the following professional summary for a ${role} role to be more impactful and concise. Do not include any conversational text, just the summary:\n\n${summary}`;

    try {
      const response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL_NAME,
          prompt,
          stream: false,
        }),
        signal: AbortSignal.timeout(5000), // 5s timeout
      });

      if (response.ok) {
        const data = await response.json();
        const improved = data.response?.trim();
        if (improved) {
          return NextResponse.json({ improved_summary: improved });
        }
      }
    } catch (ollamaErr) {
      console.warn('Ollama API error, falling back:', ollamaErr);
    }

    // Heuristic Fallback
    const words = summary.split(/\s+/);
    if (words.length < 5) {
      return NextResponse.json({
        improved_summary: `Results-driven ${role} professional with a strong foundation in core technical domains. Eager to contribute technical skills and collaborate on high-impact projects.`,
      });
    }

    return NextResponse.json({
      improved_summary: `Results-oriented ${role} professional. ${summary.trim()} Proven ability to apply technical skills to solve complex problems and collaborate effectively.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
