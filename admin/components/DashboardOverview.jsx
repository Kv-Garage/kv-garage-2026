export default function DashboardOverview({
  metrics,
  metricsLoading,
  activeModeLabel,
  onOpenCJ,
  onOpenManual,
}) {
  const cards = [
    {
      label: "Revenue",
      value: metricsLoading ? "..." : `$${Number(metrics.revenue || 0).toFixed(2)}`,
      hint: "Total captured order value",
    },
    {
      label: "Orders",
      value: metricsLoading ? "..." : metrics.orders,
      hint: "Live commerce volume",
    },
    {
      label: "Products",
      value: metricsLoading ? "..." : metrics.products,
      hint: "Catalog currently tracked",
    },
    {
      label: "Customers",
      value: metricsLoading ? "..." : metrics.customers,
      hint: "Profiles in the system",
    },
  ];

  return (
    <section className="mb-6 space-y-4">
      <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.18),_transparent_28%),linear-gradient(135deg,_#0F172A_0%,_#0B1020_45%,_#121826_100%)] p-6 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#94A3B8]">
              Executive Dashboard
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white xl:text-3xl">
              Run admin operations from one high-visibility control center.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#A8B3CF]">
              Product intake, CJ supplier flow, catalog readiness, and commercial performance
              are all visible here so the dashboard feels like the command layer, not a utility page.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 xl:min-w-[360px]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#64748B]">Live Mode</p>
              <p className="mt-2 text-base font-semibold text-white">{activeModeLabel}</p>
            </div>
            <button
              onClick={onOpenManual}
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition-colors hover:bg-white/10"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#64748B]">Workspace</p>
              <p className="mt-2 text-base font-semibold text-white">Manual Add</p>
            </button>
            <button
              onClick={onOpenCJ}
              className="rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/10 p-3 text-left transition-colors hover:bg-[#D4AF37]/15"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#AE8E24]">Supplier Flow</p>
              <p className="mt-2 text-base font-semibold text-white">Open CJ Feed</p>
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-[22px] border border-white/10 bg-[#0F172A] p-4 shadow-xl shadow-black/15"
          >
            <p className="text-sm font-medium text-[#94A3B8]">{card.label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">{card.value}</p>
            <p className="mt-1.5 text-xs text-[#64748B]">{card.hint}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
