import Link from "next/link";
import type { Icon } from "@phosphor-icons/react/lib";
import {
  ArrowCircleUp,
  ArrowRight,
  Lifebuoy,
  Megaphone,
  Prohibit,
  SealCheck,
  ShieldCheck,
  TrendDown,
  UserPlus,
  Users,
  UsersThree,
  XCircle,
} from "@phosphor-icons/react/ssr";
import {
  overviewMetrics,
  planMix,
  recentActivity,
  type ActivityType,
} from "@/lib/overview-data";

function MetricCard({
  href,
  label,
  icon: CardIcon,
  iconClassName = "text-muted",
  value,
  subtext,
  subtextClassName = "text-muted-foreground",
  note,
}: {
  href?: string;
  label: string;
  icon: Icon;
  iconClassName?: string;
  value: string | number;
  subtext: string;
  subtextClassName?: string;
  note?: string;
}) {
  const cardClassName =
    "flex flex-col gap-4 rounded-lg border border-border bg-surface p-6" +
    (href ? " transition-colors hover:border-muted hover:bg-background" : "");

  const content = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <CardIcon size={18} className={iconClassName} />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-primary">{value}</span>
          <span className={`text-sm font-medium ${subtextClassName}`}>{subtext}</span>
        </div>
        {note && <span className="text-xs text-muted">{note}</span>}
      </div>
    </>
  );

  if (!href) {
    return <div className={cardClassName}>{content}</div>;
  }

  return (
    <Link href={href} className={cardClassName}>
      {content}
    </Link>
  );
}

const activityStyles: Record<
  ActivityType,
  { icon: Icon; iconClassName: string; bgClassName: string }
> = {
  signup: { icon: UserPlus, iconClassName: "text-success", bgClassName: "bg-success-surface" },
  upgrade: {
    icon: ArrowCircleUp,
    iconClassName: "text-secondary",
    bgClassName: "bg-secondary-surface",
  },
  cancel: { icon: XCircle, iconClassName: "text-danger", bgClassName: "bg-danger-surface" },
  admin: { icon: ShieldCheck, iconClassName: "text-primary", bgClassName: "bg-primary-surface" },
};

function ShortcutRow({ href, icon: RowIcon, label }: { href: string; icon: Icon; label: string }) {
  return (
    <Link
      href={href}
      className="flex h-12 items-center gap-3 rounded-md border border-border px-3.5 hover:bg-background"
    >
      <RowIcon size={18} className="text-primary" />
      <span className="flex-1 text-sm font-medium text-primary">{label}</span>
      <ArrowRight size={15} className="text-muted" />
    </Link>
  );
}

export default function OverviewPage() {
  const { totalUsers, plusSubscribers, churnRate, newSignups, pendingSupport, deactivatedAccounts } =
    overviewMetrics;
  const planTotal = planMix.free + planMix.plus;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          href="/customers?filter=all"
          label="Total Users"
          icon={Users}
          value={totalUsers.value}
          subtext={totalUsers.subtext}
          subtextClassName="text-success"
          note={totalUsers.note}
        />
        <MetricCard
          label="Plus Subscribers"
          icon={SealCheck}
          iconClassName="text-secondary"
          value={plusSubscribers.value}
          subtext={plusSubscribers.subtext}
        />
        <MetricCard
          label="Churn Rate"
          icon={TrendDown}
          value={churnRate.value}
          subtext={churnRate.subtext}
          subtextClassName="text-danger"
        />
        <MetricCard
          label="New Signups"
          icon={UserPlus}
          value={newSignups.value}
          subtext={newSignups.subtext}
        />
        <MetricCard
          href="/customers?filter=pending-support"
          label="Pending Support"
          icon={Lifebuoy}
          iconClassName="text-warning"
          value={pendingSupport.value}
          subtext={pendingSupport.subtext}
          subtextClassName="text-warning"
        />
        <MetricCard
          href="/customers?filter=deactivated"
          label="Deactivated Accounts"
          icon={Prohibit}
          value={deactivatedAccounts.value}
          subtext={deactivatedAccounts.subtext}
        />
      </div>

      <div className="grid grid-cols-[1.7fr_1fr] gap-4">
        <div className="rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="text-base font-semibold text-primary">Recent activity</span>
            <span className="text-sm text-muted-foreground">Last 48 hours</span>
          </div>
          <div className="flex flex-col">
            {recentActivity.map((activity) => {
              const style = activityStyles[activity.type];
              const ActivityIcon = style.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 border-b border-border px-5 py-4 last:border-b-0"
                >
                  <div
                    className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md ${style.bgClassName}`}
                  >
                    <ActivityIcon size={15} className={style.iconClassName} />
                  </div>
                  <div className="min-w-0 flex-1 text-sm text-primary">
                    <span className="font-medium">{activity.name}</span> {activity.description}
                  </div>
                  <span className="whitespace-nowrap text-sm text-muted">{activity.timestamp}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Shortcuts
            </span>
            <ShortcutRow href="/customers" icon={UsersThree} label="Manage customers" />
            <ShortcutRow href="/offers" icon={Megaphone} label="New announcement" />
            <ShortcutRow href="/admins" icon={ShieldCheck} label="Admin access" />
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Plan mix
            </span>
            <div className="flex h-2.5 overflow-hidden rounded-full bg-background">
              <div
                className="bg-primary"
                style={{ width: `${(planMix.free / planTotal) * 100}%` }}
              />
              <div
                className="bg-secondary"
                style={{ width: `${(planMix.plus / planTotal) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Free · {planMix.free}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                Plus · {planMix.plus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
