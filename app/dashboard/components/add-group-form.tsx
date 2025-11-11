"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const FACEBOOK_URL_REGEX =
  /^https?:\/\/(www\.)?facebook\.com\/(groups|pages|watch)\/[A-Za-z0-9.\-_/?=]+$/i;

export function AddGroupForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function validateUrl(candidate: string) {
    return FACEBOOK_URL_REGEX.test(candidate.trim());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateUrl(url)) {
      setMessage("Necesitamos una URL valida de grupo o pagina de Facebook.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error ?? "No pudimos guardar el grupo.");
      }

      setUrl("");
      setMessage("Grupo anadido correctamente");
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("Error al guardar el grupo");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-green-900/40 bg-slate-900/60 p-6 text-green-50"
    >
      <label className="block text-sm text-green-300">
        URL del grupo o pagina
        <input
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://www.facebook.com/groups/wp.expertos"
          className="mt-2 w-full rounded-2xl border border-green-800/60 bg-slate-950/60 px-4 py-3 text-green-50 placeholder:text-green-500/70 focus:border-green-400 focus:outline-none"
          required
        />
      </label>
      <button
        disabled={saving}
        className="w-full rounded-2xl bg-green-500 px-4 py-3 font-semibold text-slate-900 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Guardando..." : "Anadir grupo"}
      </button>
      {message && (
        <p className="text-sm text-green-300" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
