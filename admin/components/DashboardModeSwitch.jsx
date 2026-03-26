import Link from "next/link";

export default function DashboardModeSwitch({ mode, setMode }) {
  return (
    <div className="mb-8 flex flex-wrap gap-4">
      <button
        onClick={() => setMode("manual")}
        className={`rounded-lg px-6 py-3 font-semibold transition-all ${
          mode === "manual"
            ? "bg-[#D4AF37] text-black"
            : "bg-[#1C2233] text-gray-300 hover:bg-[#2A3441]"
        }`}
      >
        Manual Add
      </button>
      <button
        onClick={() => setMode("cj")}
        className={`rounded-lg px-6 py-3 font-semibold transition-all ${
          mode === "cj"
            ? "bg-[#D4AF37] text-black"
            : "bg-[#1C2233] text-gray-300 hover:bg-[#2A3441]"
        }`}
      >
        CJ Dropshipping
      </button>
      <Link
        href="/admin/bulk-import"
        className="rounded-lg bg-[#1C2233] px-6 py-3 font-semibold text-gray-300 transition-all hover:bg-[#2A3441]"
      >
        Bulk Import
      </Link>
    </div>
  );
}
