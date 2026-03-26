export function AdminPageShell({ eyebrow, title, description, actions, children }) {
  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-white/10 bg-[#0F172A] px-6 py-6 shadow-2xl shadow-black/20 sm:px-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#94A3B8]">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {title}
            </h1>
            {description ? (
              <p className="mt-3 text-sm leading-7 text-[#94A3B8]">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </section>

      {children}
    </div>
  );
}

export function AdminMetricCard({ label, value, hint }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#111827] p-6 shadow-lg shadow-black/10">
      <p className="text-sm font-medium text-[#94A3B8]">{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{value}</p>
      {hint ? <p className="mt-2 text-sm text-[#64748B]">{hint}</p> : null}
    </div>
  );
}

export function AdminLoadingState({ label = "Loading data..." }) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/10 bg-[#0F172A] px-6 py-16 text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#334155] border-t-[#D4AF37]" />
      <p className="mt-5 text-sm text-[#94A3B8]">{label}</p>
    </div>
  );
}

export function AdminEmptyState({ title, description }) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/10 bg-[#0F172A] px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg text-white">
        0
      </div>
      <h2 className="mt-5 text-xl font-semibold text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-[#94A3B8]">
        {description}
      </p>
    </div>
  );
}

export function AdminErrorState({ message }) {
  return (
    <div className="rounded-[24px] border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
      {message}
    </div>
  );
}

export function AdminTableCard({ children }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0F172A] shadow-2xl shadow-black/20">
      {children}
    </section>
  );
}
