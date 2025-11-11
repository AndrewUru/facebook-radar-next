type GroupCardProps = {
  url: string;
  groupKey: string | null;
  createdAt: string | null;
};

export function GroupCard({ url, groupKey, createdAt }: GroupCardProps) {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString()
    : "Sin fecha";

  return (
    <article className="rounded-3xl border border-green-900/40 bg-slate-900/60 p-5 text-green-50 shadow-lg shadow-green-900/10">
      <p className="text-sm text-green-400">{groupKey ?? "Grupo sin alias"}</p>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-1 block text-lg font-semibold text-green-50 underline-offset-2 hover:underline"
      >
        {url}
      </a>
      <p className="mt-3 text-xs text-green-300/80">
        Registrado el {formattedDate}
      </p>
    </article>
  );
}
