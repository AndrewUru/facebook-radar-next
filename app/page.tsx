import Link from "next/link";

import { FeatureCard } from "./components/feature-card";
import { RadarLinkButton } from "./components/radar-button";

const features = [
  {
    title: "Detecta briefs reales",
    badge: "Oportunidades",
    description:
      "Escaneamos grupos de desarrollo web y filtramos posts donde piden sitios, funnels o mejoras urgentes.",
  },
  {
    title: "Contexto accionable",
    badge: "IA OpenAI",
    description:
      "La IA resume el presupuesto estimado, tipo de cliente y tech stack mencionado para que respondas primero.",
  },
  {
    title: "Entrega directa",
    badge: "Telegram Bot",
    description:
      "Cada hallazgo llega a tu Telegram con un playbook de respuesta y CTA sugerido.",
  },
];

export default function Home() {
  return (
    <main className="relative isolate min-h-screen bg-slate-950 px-6 py-16 text-green-200">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 font-mono">
        <header className="flex flex-col gap-6 text-center sm:text-left">
          <p className="text-sm uppercase tracking-[0.4em] text-green-500">
            Radar para estudios y freelancers web
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-green-50 sm:text-5xl">
            Conecta grupos de Facebook sobre desarrollo web y recibe
            oportunidades listas para cerrar.
          </h1>
          <p className="text-base text-green-300 sm:text-lg">
            Configura los grupos que sigues, deja que OpenAI lea cada post y
            recibe en tu Telegram un resumen con la probabilidad de cliente,
            urgencia y recomendacion de respuesta.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <RadarLinkButton href="/analyze" size="lg">
              Probar gratis
            </RadarLinkButton>
            <RadarLinkButton href="/login" variant="ghost">
              Entrar al dashboard
            </RadarLinkButton>
          </div>
          <Link
            href="https://t.me"
            className="text-sm text-green-400 transition hover:text-green-200"
          >
            Quiero alertas en Telegram
          </Link>
        </header>

        <section className="grid gap-4 text-left sm:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </section>

        <section className="grid gap-8 rounded-3xl border border-green-900/40 bg-slate-900/60 p-8 shadow-xl shadow-green-900/20 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-green-500">
              Flujo automatico
            </p>
            <h2 className="text-2xl text-green-50">
              3 pasos para que los grupos traigan clientes solos.
            </h2>
            <ul className="list-disc space-y-2 pl-4 text-sm text-green-200/80">
              <li>Conectas tus grupos/paginas de dev desde el dashboard.</li>
              <li>
                Playwright + OpenAI detectan publicaciones buscando sitios,
                landings, integraciones o soporte tecnico.
              </li>
              <li>
                Recibes en Telegram el resumen, nivel de confianza y CTA
                sugerido para responder en segundos.
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-green-800/40 bg-slate-950/80 p-6 text-sm text-green-300">
            <p className="text-xs uppercase text-green-500">Ejemplo</p>
            <p className="mt-4 whitespace-pre-wrap">
              "Buscamos dev que se encargue del rediseño de nuestra web de
              ecommerce (Shopify + React). Presupuesto inicial 2k USD. Queremos
              ir en dos semanas."
              {"\n\n"}
              Radar IA: Cliente serio (80%). Recomienda responder con 2 casos
              de ecommerce, proponer un sprint discovery y ofrecer llamada en 24h.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-6 rounded-3xl border border-green-900/30 bg-gradient-to-br from-slate-900 to-slate-950 p-10 text-center sm:text-left">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-green-500">
              Pensado para builders
            </p>
            <h3 className="mt-4 text-3xl text-green-50">
              Telegram, CRM, Google Sheets: todo listo para integrarse.
            </h3>
            <p className="mt-2 text-green-200/80">
              Cada oportunidad llega con etiquetas (stack, presupuesto,
              urgencia). Puedes reenviarla a tu CRM, Notion o Slack para
              centralizar pipeline y medir conversiones.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
            <RadarLinkButton href="/analyze" variant="secondary">
              Empezar ahora
            </RadarLinkButton>
            <span className="text-xs text-green-400">
              100% gratuito durante el beta publico.
            </span>
          </div>
        </section>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.15),_transparent_45%)]" />
    </main>
  );
}
