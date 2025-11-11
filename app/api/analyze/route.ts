import { NextResponse } from "next/server";

const MAX_CHARACTERS = 2000;
const SYSTEM_PROMPT =
  "Eres Facebook Radar, un analista que resume publicaciones en espanol. Devuelve tres apartados: Tono, Intencion, Publico objetivo. Se breve y accionable.";
const OPENAI_URL = "https://api.openai.com/v1/responses";

type OpenAIResponse = {
  output_text?: string[];
  output?: Array<{
    content?: Array<{
      type: string;
      text?: { value?: string };
    }>;
  }>;
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY no esta configurada." },
      { status: 500 },
    );
  }

  let text: string | undefined;
  try {
    const body = await request.json();
    text = typeof body?.text === "string" ? body.text.trim() : undefined;
  } catch {
    return NextResponse.json(
      { error: "Formato invalido. Envia JSON con { text }." },
      { status: 400 },
    );
  }

  if (!text) {
    return NextResponse.json(
      { error: "Necesitamos un texto para analizar." },
      { status: 400 },
    );
  }

  if (text.length > MAX_CHARACTERS) {
    return NextResponse.json(
      { error: "El texto supera el limite de 2000 caracteres." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
        temperature: 0.2,
        max_output_tokens: 400,
        input: `${SYSTEM_PROMPT}\n\nTexto:\n${text}`,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      console.error("OpenAI error", errorBody);
      return NextResponse.json(
        { error: "No pudimos generar el analisis." },
        { status: 502 },
      );
    }

    const data = (await response.json()) as OpenAIResponse;
    const analysis = extractAnalysis(data);

    if (!analysis) {
      return NextResponse.json(
        { error: "El modelo no devolvio contenido." },
        { status: 502 },
      );
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("OpenAI request failed", error);
    return NextResponse.json(
      { error: "Fallo el servicio de IA. Intenta mas tarde." },
      { status: 500 },
    );
  }
}

function extractAnalysis(payload: OpenAIResponse): string {
  if (Array.isArray(payload.output_text) && payload.output_text.length > 0) {
    return payload.output_text.join("\n").trim();
  }

  if (payload.output?.length) {
    const combined = payload.output
      .map((item) =>
        item.content
          ?.map((entry) =>
            entry.type === "output_text" ? entry.text?.value ?? "" : "",
          )
          .join("\n"),
      )
      .join("\n")
      .trim();

    if (combined) {
      return combined;
    }
  }

  return "";
}
