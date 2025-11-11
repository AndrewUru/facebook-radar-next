"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { GroupWatchForm } from "../components/group-watch-form";
import { RadarButton, RadarLinkButton } from "../components/radar-button";
import { SubscribeForm } from "../components/subscribe-form";

const MAX_CHARACTERS = 2000;

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const charactersLeft = MAX_CHARACTERS - text.length;

  const helperMessages = useMemo(
    () => [
      "Detecta el tono (positivo/negativo) y la emocion dominante.",
      "Resume la intencion: venta, convocatoria, debate, anuncio oficial.",
      "Sugiere que publico reaccionara mas y como responder.",
    ],
    [],
  );

  async function handleAnalyze() {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Pega un texto o enlace para poder analizarlo.");
      return;
    }

    if (trimmed.length > MAX_CHARACTERS) {
      setError("El texto supera el limite de 2000 caracteres.");
      return;
    }

    setError("");
    setIsLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error ?? "No pudimos analizar el texto.");
      }

      const data = await response.json();
      setResult(data.analysis ?? "Sin resultados. Intenta nuevamente.");
    } catch (analysisError) {
      console.error(analysisError);
      setError("La IA no respondio. Revisa tu clave o intentalo mas tarde.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-green-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 font-mono">
        <header className="flex flex-col gap-4 text-center sm:text-left">
          <p className="text-xs uppercase tracking-[0.4em] text-green-500">
            Analizador IA
          </p>
          <h1 className="text-4xl text-green-50">
            Pega un post de Facebook, obten insights inmediatos.
          </h1>
          <p className="text-sm text-green-300 sm:text-base">
            Usa la version publica sin registros. Si quieres guardar alertas,
            deja tu correo o Telegram.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <RadarLinkButton href="/" variant="ghost">
              &larr; Volver a la landing
            </RadarLinkButton>
            <Link
              href="/dashboard"
              className="text-xs text-green-400 transition hover:text-green-200"
            >
              Ir al dashboard privado
            </Link>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-6 rounded-3xl border border-green-900/40 bg-slate-900/60 p-6 shadow-lg shadow-green-900/20">
            <div className="space-y-3">
              <label
                htmlFor="analyze-input"
                className="text-sm uppercase tracking-[0.4em] text-green-500"
              >
                Texto o enlace
              </label>
              <textarea
                id="analyze-input"
                rows={8}
                maxLength={MAX_CHARACTERS}
                placeholder="Pega aqui una publicacion, comentario, anuncio o enlace publico..."
                className="w-full rounded-2xl border border-green-800/40 bg-slate-950/60 p-4 text-sm text-green-100 placeholder:text-green-400 focus:border-green-400 focus:outline-none"
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                  setError("");
                }}
              />
              <div className="flex flex-wrap items-center justify-between text-xs text-green-400">
                <span>Limite: {MAX_CHARACTERS} caracteres</span>
                <span
                  className={
                    charactersLeft < 0 ? "text-red-400" : "text-green-400"
                  }
                >
                  {charactersLeft} restantes
                </span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <RadarButton onClick={handleAnalyze} disabled={isLoading}>
                {isLoading ? "Analizando..." : "Analizar"}
              </RadarButton>
              <RadarButton
                type="button"
                variant="ghost"
                onClick={() => {
                  setText("");
                  setResult("");
                  setError("");
                }}
              >
                Limpiar
              </RadarButton>
            </div>

            <div className="space-y-3 rounded-2xl border border-green-900/30 bg-slate-950/40 p-4">
              <p className="text-sm uppercase tracking-[0.4em] text-green-500">
                Resultado
              </p>
              {result ? (
                <p className="whitespace-pre-wrap text-sm text-green-100">
                  {result}
                </p>
              ) : (
                <p className="text-sm text-green-300/80">
                  Cuando envies un texto mostraremos el resumen de tono,
                  intencion y publico esperado aqui.
                </p>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-green-900/40 bg-slate-900/50 p-5">
              <p className="text-xs uppercase tracking-[0.4em] text-green-500">
                Tips
              </p>
              <ul className="mt-3 space-y-2 text-sm text-green-200/80">
                {helperMessages.map((message) => (
                  <li key={message} className="flex gap-2">
                    <span className="text-green-500">&gt;</span>
                    <span>{message}</span>
                  </li>
                ))}
              </ul>
            </div>

            <GroupWatchForm />

            <SubscribeForm />

            <div className="rounded-3xl border border-green-900/40 bg-slate-900/70 p-5 text-sm text-green-200/90">
              <p className="text-xs uppercase tracking-[0.4em] text-green-500">
                Que sigue
              </p>
              <div className="mt-2 space-y-2">
                <p>
                  Conecta `/api/groups` a un worker que utilice la Graph API
                  (permiso `groups_access_member_info`). Dispara un Vercel Cron
                  cada 5 minutos para consultar /{'{group-id}'}/feed y enviar los
                  posts nuevos a <code>/api/analyze</code>.
                </p>
                <p>
                  Usa `/api/subscribe` para guardar los canales de alerta y
                  notificar cuando detectemos publicaciones relevantes.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
