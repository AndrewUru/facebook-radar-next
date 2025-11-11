"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";
  const supabaseReady =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const supabase = useMemo(
    () => (supabaseReady ? createBrowserSupabaseClient() : null),
    [supabaseReady],
  );

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setStatus("error");
      setMessage(
        "Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
      return;
    }
    if (!email.trim()) {
      setStatus("error");
      setMessage("Necesitamos un correo para enviarte el enlace magico.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const origin =
        typeof window === "undefined"
          ? process.env.NEXT_PUBLIC_SITE_URL ?? ""
          : window.location.origin;

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
            redirect,
          )}`,
        },
      });

      if (error) {
        throw error;
      }

      setStatus("success");
      setMessage(
        "Revisa tu correo. Enviamos un enlace magico para acceder al dashboard.",
      );
      setEmail("");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("No pudimos enviar el enlace. Intenta nuevamente.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-green-900/40 bg-slate-900/60 p-6 text-green-50"
    >
      <p className="text-xs uppercase tracking-[0.4em] text-green-500">
        Acceso privado
      </p>
      <h2 className="text-2xl text-green-50">Ingresa a tu Facebook Radar</h2>
      <p className="text-sm text-green-200/80">
        Te enviaremos un enlace magico a tu correo. Usalo para acceder y ver tus
        grupos vigilados.
      </p>

      {!supabaseReady && (
        <p className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-yellow-200">
          Configura las variables NEXT_PUBLIC_SUPABASE_URL y
          NEXT_PUBLIC_SUPABASE_ANON_KEY para habilitar el acceso al dashboard.
        </p>
      )}

      <label className="block text-sm text-green-300">
        Correo electronico
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setStatus("idle");
            setMessage("");
          }}
          className="mt-2 w-full rounded-2xl border border-green-800/50 bg-slate-950/50 px-4 py-3 text-green-100 placeholder:text-green-500/60 focus:border-green-400 focus:outline-none"
          placeholder="tu@email.com"
          required
        />
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-2xl bg-green-500 px-4 py-3 font-semibold text-slate-900 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Enviando..." : "Recibir enlace"}
      </button>

      {message && (
        <p
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
