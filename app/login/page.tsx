import Link from "next/link";
import type { Metadata } from "next";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Iniciar sesion | Facebook Radar",
  description: "Accede a tu dashboard privado para vigilar grupos y paginas.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-green-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 font-mono lg:flex-row">
        <section className="flex flex-1 flex-col justify-center gap-4">
          <p className="text-xs uppercase tracking-[0.4em] text-green-500">
            Dashboard seguro
          </p>
          <h1 className="text-4xl text-green-50">
            Conecta tus grupos y recibe insights privados.
          </h1>
          <p className="text-sm text-green-200/90">
            Facebook Radar usa Supabase Auth para crear un espacio personal. Cada
            usuario tiene sus grupos, posts detectados y alertas configuradas.
          </p>
          <Link
            href="/"
            className="text-sm text-green-400 transition hover:text-green-200"
          >
            &larr; Volver a la landing publica
          </Link>
        </section>

        <section className="flex-1">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
