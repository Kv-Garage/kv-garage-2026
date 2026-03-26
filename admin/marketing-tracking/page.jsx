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

const channels = [
  { name: "Email", roi: "4.8x", spend: "$2,400", status: "Healthy" },
  { name: "Affiliate", roi: "3.2x", spend: "$1,180", status: "Growing" },
  { name: "Paid Social", roi: "2.4x", spend: "$4,920", status: "Watch" },
  { name: "Organic", roi: "6.1x", spend: "$0", status: "Strong" },
];

export default function AdminMarketingTrackingPage() {
  return (
    <AdminGuard>
      <AdminLayout
        title="Marketing Tracking"
        description="Campaign attribution, channel health, and growth monitoring."
      >
        <AdminPageShell
          eyebrow="Growth Ops"
          title="Marketing Tracking"
          description="Keep campaign performance, spend discipline, and attribution visibility in one clean control layer."
        >
          <AdminStatGrid>
            <AdminMetricCard label="Tracked Channels" value="4" hint="Core growth surfaces monitored" />
            <AdminMetricCard label="Attributed Revenue" value="$28,400" hint="Revenue linked to campaigns" />
            <AdminMetricCard label="ROAS" value="3.9x" hint="Average blended performance" />
            <AdminMetricCard label="Active Campaigns" value="12" hint="Live growth pushes" />
          </AdminStatGrid>

          <AdminTableCard>
            <AdminSectionHeader
              title="Channel performance"
              description="High-level marketing visibility for the team to review at a glance."
            />
            <div className="space-y-3 p-4">
              {channels.map((channel) => (
                <div
                  key={channel.name}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{channel.name}</p>
                    <p className="mt-1 text-xs text-[#94A3B8]">Spend: {channel.spend}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold text-white">{channel.roi}</p>
                    <AdminStatusBadge
                      tone={
                        channel.status === "Strong" || channel.status === "Healthy"
                          ? "success"
                          : channel.status === "Watch"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {channel.status}
                    </AdminStatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </AdminTableCard>
        </AdminPageShell>
      </AdminLayout>
    </AdminGuard>
  );
}
