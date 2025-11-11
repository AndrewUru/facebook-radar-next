type FeatureCardProps = {
  title: string;
  description: string;
  badge: string;
};

export function FeatureCard({ title, description, badge }: FeatureCardProps) {
  return (
    <article className="rounded-3xl border border-green-900/30 bg-slate-900/40 p-6 text-green-200 shadow-lg shadow-green-900/10">
      <span className="text-xs uppercase tracking-[0.5em] text-green-500">
        {badge}
      </span>
      <h3 className="mt-3 text-xl text-green-50">{title}</h3>
      <p className="mt-2 text-sm text-green-300/90">{description}</p>
    </article>
  );
}
