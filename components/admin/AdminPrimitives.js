export function AdminStatGrid({ children, columns = "xl:grid-cols-4" }) {
  return <section className={`grid gap-4 md:grid-cols-2 ${columns}`}>{children}</section>;
}

export function AdminSectionHeader({ title, description, actions }) {
  return (
    <div className="border-b border-white/10 px-6 py-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-[#94A3B8]">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}

export function AdminStatusBadge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "border border-white/10 bg-white/5 text-white",
    success: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    warning: "border border-amber-500/30 bg-amber-500/10 text-amber-300",
    accent: "border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#FDE68A]",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${tones[tone] || tones.neutral}`}>
      {children}
    </span>
  );
}

export function AdminDataTable({ columns, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-[#CBD5E1]">
        <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-[#94A3B8]">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-6 py-4 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
