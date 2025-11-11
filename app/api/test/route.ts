import { NextResponse } from "next/server";

export async function GET() {
  const { BOT_TOKEN, CHAT_ID, OPENAI_API_KEY } = process.env;

  if (!BOT_TOKEN || !CHAT_ID || !OPENAI_API_KEY) {
    return NextResponse.json(
      {
        ok: false,
        message: "Faltan variables de entorno (BOT_TOKEN, CHAT_ID, OPENAI_API_KEY)",
      },
      { status: 500 },
    );
  }

  const message = "Variables cargadas correctamente desde .env.local";

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
      },
    );

    if (!telegramResponse.ok) {
      const errorBody = await telegramResponse.json().catch(() => null);
      console.error("Telegram API error", errorBody);
      return NextResponse.json(
        { ok: false, message: "Telegram no respondio correctamente" },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Telegram fetch failed", error);
    return NextResponse.json(
      { ok: false, message: "No se pudo contactar a Telegram" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Mensaje enviado al chat de Telegram",
  });
}
