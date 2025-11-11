import Link from "next/link";
import { redirect } from "next/navigation";

import { AddGroupForm } from "@/app/dashboard/components/add-group-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AddGroupPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/add-group");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-green-50">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 font-mono">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-green-500">
            Nuevo grupo
          </p>
          <h1 className="text-4xl">Anade una URL a tu radar</h1>
          <p className="text-sm text-green-200/80">
            Aceptamos grupos, paginas y watch feeds publicos. Si son privados,
            necesitaras tu Playwright bot o Edge Function con cookies propias.
          </p>
          <Link
            href="/dashboard"
            className="text-sm text-green-400 transition hover:text-green-200"
          >
            <- Volver al dashboard
          </Link>
        </header>

        <AddGroupForm />
      </div>
    </main>
  );
}
