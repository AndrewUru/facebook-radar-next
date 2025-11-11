import { NextResponse } from "next/server";

type SubscribePayload = {
  email?: string;
  telegramHandle?: string;
};

export async function POST(request: Request) {
  let payload: SubscribePayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido." }, { status: 400 });
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const telegramHandle =
    typeof payload.telegramHandle === "string"
      ? payload.telegramHandle.trim()
      : "";

  if (!email && !telegramHandle) {
    return NextResponse.json(
      { error: "Envia un email o usuario de Telegram." },
      { status: 400 },
    );
  }

  if (email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
    return NextResponse.json(
      { error: "El correo no parece valido." },
      { status: 400 },
    );
  }

  if (telegramHandle && !telegramHandle.startsWith("@")) {
    return NextResponse.json(
      { error: "El usuario de Telegram debe iniciar con @." },
      { status: 400 },
    );
  }

  const entry = {
    email: email || undefined,
    telegramHandle: telegramHandle || undefined,
    createdAt: new Date().toISOString(),
  };

  try {
    if (process.env.SUBSCRIBER_WEBHOOK_URL) {
      await fetch(process.env.SUBSCRIBER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
    }

    console.info("Nuevo registro Facebook Radar", entry);
  } catch (error) {
    console.error("Error enviando el registro", error);
    return NextResponse.json(
      {
        error:
          "No pudimos guardar el registro en el servicio remoto. Intenta mas tarde.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
