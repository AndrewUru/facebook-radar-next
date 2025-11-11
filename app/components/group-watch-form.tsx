"use client";

import { FormEvent, useState } from "react";

import { RadarButton } from "./radar-button";

type Channel = "email" | "telegram";
type Frequency = "realtime" | "daily";

const frequencyCopy: Record<Frequency, string> = {
  realtime: "Alertas inmediatas",
  daily: "Resumen diario",
};

const FACEBOOK_GROUP_REGEX =
  /^https?:\/\/(www\.)?facebook\.com\/groups\/[A-Za-z0-9.\-_]+\/?$/i;

export function GroupWatchForm() {
  const [groupUrl, setGroupUrl] = useState("");
  const [channel, setChannel] = useState<Channel>("email");
  const [contact, setContact] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("realtime");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  function resetFeedback() {
    setStatus("idle");
    setMessage("");
  }

  function isValidGroupUrl(url: string) {
    return FACEBOOK_GROUP_REGEX.test(url.trim());
  }

  function getContactPlaceholder() {
    return channel === "email" ? "alertas@tuempresa.com" : "@tu_usuario";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidGroupUrl(groupUrl)) {
      setStatus("error");
      setMessage("El enlace debe apuntar a un grupo publico o privado.");
      return;
    }

    if (!contact.trim()) {
      setStatus("error");
      setMessage("Necesitamos un correo o usuario de Telegram para avisarte.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupUrl: groupUrl.trim(),
          channel,
          contact: contact.trim(),
          frequency,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error || "No pudimos guardar el grupo.");
      }

      setStatus("success");
      setMessage("Listo, comenzaremos a monitorear ese grupo.");
      setGroupUrl("");
      setContact("");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Hubo un error al guardar el grupo. Intenta de nuevo.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-green-900/40 bg-slate-900/60 p-6"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-green-500">
          Monitoreo de grupos
        </p>
        <h4 className="mt-2 text-xl text-green-50">
          Anade un grupo y detectaremos nuevas publicaciones
        </h4>
      </div>

      <div className="space-y-2 text-sm">
        <label className="text-green-400" htmlFor="group-link">
          URL del grupo de Facebook
        </label>
        <input
          id="group-link"
          type="url"
          value={groupUrl}
          onChange={(event) => {
            setGroupUrl(event.target.value);
            resetFeedback();
          }}
          placeholder="https://www.facebook.com/groups/tu-grupo"
          className="w-full rounded-2xl border border-green-800/60 bg-slate-950/50 px-4 py-3 text-green-100 placeholder:text-green-500/70 focus:border-green-400 focus:outline-none"
        />
      </div>

      <div className="space-y-2 text-sm">
        <label className="text-green-400" htmlFor="contact-value">
          Donde avisarte
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 rounded-2xl border border-green-800/60 p-1 text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
            {(["email", "telegram"] as Channel[]).map((option) => (
              <button
                key={option}
                type="button"
                className={`flex-1 rounded-2xl px-3 py-2 ${
                  channel === option
                    ? "bg-green-500/20 text-green-100"
                    : "text-green-400"
                }`}
                onClick={() => {
                  setChannel(option);
                  resetFeedback();
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <input
            id="contact-value"
            type="text"
            value={contact}
            onChange={(event) => {
              setContact(event.target.value);
              resetFeedback();
            }}
            placeholder={getContactPlaceholder()}
            className="flex-1 rounded-2xl border border-green-800/60 bg-slate-950/50 px-4 py-3 text-green-100 placeholder:text-green-500/70 focus:border-green-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <p className="text-green-400">Frecuencia de deteccion</p>
        <div className="flex flex-wrap gap-2">
          {(["realtime", "daily"] as Frequency[]).map((option) => (
            <button
              type="button"
              key={option}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] ${
                frequency === option
                  ? "border-green-400 text-green-100"
                  : "border-green-900 text-green-400"
              }`}
              onClick={() => {
                setFrequency(option);
                resetFeedback();
              }}
            >
              {frequencyCopy[option]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <RadarButton type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Guardando..." : "Anadir grupo"}
        </RadarButton>
        <p className="text-xs text-green-400">
          Requiere que seas admin del grupo para conectar la API de Facebook.
        </p>
      </div>

      {message && (
        <p
          role="status"
          className={`text-sm ${
            status === "error" ? "text-red-400" : "text-green-400"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
