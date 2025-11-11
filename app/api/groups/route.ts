import { NextRequest, NextResponse } from "next/server";

import { createRouteSupabaseClient } from "@/lib/supabase/server";

const FACEBOOK_URL_REGEX =
  /^https?:\/\/(www\.)?facebook\.com\/(groups|pages|watch)\/[A-Za-z0-9.\-_/?=]+$/i;

type Channel = "email" | "telegram";
type Frequency = "realtime" | "daily";

type Payload = {
  url?: string;
  groupUrl?: string;
  channel?: Channel;
  contact?: string;
  frequency?: Frequency;
};

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i;

function isValidContact(channel: Channel, contact: string) {
  if (channel === "email") {
    return emailRegex.test(contact);
  }
  return contact.startsWith("@") && contact.length > 3;
}

function buildGroupKey(url: string) {
  return url.split("facebook.com/")[1]?.replace(/\/$/, "") ?? url;
}

export async function POST(request: NextRequest) {
  let payload: Payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON invalido. Envia la URL a registrar." },
      { status: 400 },
    );
  }

  const url = (payload.url ?? payload.groupUrl ?? "").trim();
  if (!FACEBOOK_URL_REGEX.test(url)) {
    return NextResponse.json(
      { error: "El enlace debe apuntar a un grupo o pagina de Facebook." },
      { status: 400 },
    );
  }

  const supabase = createRouteSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { error } = await supabase.from("group_watchers").insert({
      url,
      group_key: buildGroupKey(url),
      user_id: user.id,
    });

    if (error) {
      console.error("Supabase insert error", error);
      return NextResponse.json(
        { error: "No pudimos guardar el grupo en tu cuenta." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, source: "dashboard" });
  }

  const channel: Channel = payload.channel ?? "email";
  const contact = payload.contact?.trim() ?? "";
  const frequency: Frequency = payload.frequency ?? "realtime";

  if (!contact || !isValidContact(channel, contact)) {
    return NextResponse.json(
      { error: "Necesitamos un contacto valido (email o Telegram)." },
      { status: 400 },
    );
  }

  const entry = {
    groupUrl: url,
    channel,
    contact,
    frequency,
    createdAt: new Date().toISOString(),
  };

  try {
    if (process.env.GROUP_WATCH_WEBHOOK_URL) {
      await fetch(process.env.GROUP_WATCH_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
    } else {
      console.info("Group watch registered (sin usuario)", entry);
    }
  } catch (error) {
    console.error("Error enviando el grupo a la cola", error);
    return NextResponse.json(
      {
        error:
          "No pudimos almacenar el grupo monitoreado. Verifica el webhook externo.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, source: "public-form" });
}
