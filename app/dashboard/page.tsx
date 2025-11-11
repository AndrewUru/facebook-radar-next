import Link from "next/link";
import { redirect } from "next/navigation";

import { GroupCard } from "@/app/dashboard/components/group-card";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const { data: groups = [] } = await supabase
    .from("group_watchers")
    .select("id,url,group_key,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-green-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 font-mono">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-green-500">
              Dashboard
            </p>
            <h1 className="text-4xl text-green-50">
              Tus grupos y paginas vigiladas
            </h1>
            <p className="text-sm text-green-200/80">
              Cada registro activa el crawler (scraping + IA) para avisarte de
              nuevos posts y enviarlos a Telegram o email.
            </p>
          </div>
          <Link
            href="/dashboard/add-group"
            className="rounded-2xl bg-green-500 px-5 py-3 text-center font-semibold text-slate-900 transition hover:bg-green-400"
          >
            Anadir nuevo grupo
          </Link>
        </header>

        {groups?.length === 0 ? (
          <div className="rounded-3xl border border-green-900/50 bg-slate-900/60 p-8 text-center text-green-200/80">
            <p>No tienes grupos conectados todavia.</p>
            <p className="mt-2">
              Usa el boton "Anadir nuevo grupo" para empezar a monitorear
              cualquier URL de Facebook (grupo o pagina).
            </p>
          </div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                url={group.url}
                groupKey={group.group_key}
                createdAt={group.created_at}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
