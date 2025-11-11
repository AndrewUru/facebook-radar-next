'use client';

import { FormEvent, useState } from "react";

import { RadarButton } from "./radar-button";

type Channel = "email" | "telegram";

export function SubscribeForm() {
  const [channel, setChannel] = useState<Channel>("email");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  function resetFeedback() {
    setStatus("idle");
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value.trim()) {
      setStatus("error");
      setMessage("Agrega un correo o usuario de Telegram valido.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const payload =
        channel === "email"
          ? { email: value.trim() }
          : { telegramHandle: value.trim() };

      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("No pudimos guardar tu alerta. Intenta mas tarde.");
      }

      setStatus("success");
      setMessage(
        channel === "email"
          ? "Listo, te avisaremos por correo."
          : "Perfecto, te escribiremos por Telegram.",
      );
      setValue("");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Error inesperado. Vuelve a intentar.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-green-900/40 bg-slate-950/60 p-5"
    >
      <div>
        <p className="text-sm uppercase tracking-[0.4em] text-green-500">
          Alertas
        </p>
        <h4 className="mt-1 text-lg text-green-50">
          Recibe reportes por correo o Telegram
        </h4>
      </div>

      <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
        <label className="flex items-center gap-2 rounded-full border border-green-800/60 px-4 py-2">
          <input
            type="radio"
            name="channel"
            value="email"
            checked={channel === "email"}
            onChange={() => {
              setChannel("email");
              resetFeedback();
            }}
            className="accent-green-500"
          />
          Email
        </label>
        <label className="flex items-center gap-2 rounded-full border border-green-800/60 px-4 py-2">
          <input
            type="radio"
            name="channel"
            value="telegram"
            checked={channel === "telegram"}
            onChange={() => {
              setChannel("telegram");
              resetFeedback();
            }}
            className="accent-green-500"
          />
          Telegram
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            resetFeedback();
          }}
          placeholder={
            channel === "email" ? "tu@email.com" : "@usuario_telegram"
          }
          className="flex-1 rounded-2xl border border-green-800/60 bg-slate-900/50 px-4 py-3 text-sm text-green-100 placeholder:text-green-500/70 focus:border-green-400 focus:outline-none"
        />
        <RadarButton
          type="submit"
          variant="ghost"
          className="whitespace-nowrap"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Guardando..." : "Guardar alerta"}
        </RadarButton>
      </div>

      {message && (
        <p
          className={`text-xs ${
            status === "error" ? "text-red-400" : "text-green-400"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
