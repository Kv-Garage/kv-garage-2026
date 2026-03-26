import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../layout";
import {
  AdminMetricCard,
  AdminPageShell,
  AdminTableCard,
} from "../../components/admin/AdminPageShell";
import {
  AdminSectionHeader,
  AdminStatGrid,
  AdminStatusBadge,
} from "../../components/admin/AdminPrimitives";

const queue = [
  { task: "High-risk order review", owner: "Admin Team", status: "Open" },
  { task: "VIP customer callback", owner: "Support", status: "In Progress" },
  { task: "Supplier exception check", owner: "Ops", status: "Queued" },
  { task: "Manual fulfillment override", owner: "Warehouse", status: "Open" },
];

export default function AdminManualOpsPage() {
  return (
    <AdminGuard>
      <AdminLayout
        title="Manual Ops"
        description="High-touch operational control for exceptions and intervention workflows."
      >
        <AdminPageShell
          eyebrow="Operations"
          title="Manual Ops"
          description="Track human-review work, exception handling, and critical follow-up items without crowding the main dashboard."
        >
          <AdminStatGrid>
            <AdminMetricCard label="Open Tasks" value="9" hint="Needs admin attention" />
            <AdminMetricCard label="Priority Reviews" value="3" hint="Time-sensitive interventions" />
            <AdminMetricCard label="Escalations" value="2" hint="Active issues in queue" />
            <AdminMetricCard label="Resolved Today" value="14" hint="Closed by operations team" />
          </AdminStatGrid>

          <AdminTableCard>
            <AdminSectionHeader
              title="Manual review queue"
              description="Operational handoffs and exception management for the backend team."
            />
            <div className="space-y-3 p-4">
              {queue.map((item) => (
                <div
                  key={item.task}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{item.task}</p>
                    <p className="mt-1 text-xs text-[#94A3B8]">{item.owner}</p>
                  </div>
                  <AdminStatusBadge
                    tone={
                      item.status === "In Progress"
                        ? "accent"
                        : item.status === "Queued"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {item.status}
                  </AdminStatusBadge>
                </div>
              ))}
            </div>
          </AdminTableCard>
        </AdminPageShell>
      </AdminLayout>
    </AdminGuard>
  );
}
