"use client";

import { useState } from "react";
import type { Icon } from "@phosphor-icons/react";
import {
  CaretDown,
  CaretUp,
  Check,
  CheckCircle,
  EnvelopeSimple,
  Lifebuoy,
  PaperPlaneTilt,
  Prohibit,
  SealCheck,
  ShieldStar,
  UserMinus,
} from "@phosphor-icons/react";
import {
  activityLog,
  admins as initialAdmins,
  type Admin,
  type ActivityType,
} from "@/lib/admins-data";

type AdminRoleChoice = "Super admin" | "Support admin";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function RolePill({ role }: { role: Admin["role"] }) {
  const className =
    role === "Super admin"
      ? "bg-secondary-surface text-secondary-foreground"
      : "bg-primary-surface text-muted-foreground";
  return (
    <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-sm font-medium ${className}`}>
      {role}
    </span>
  );
}

const activityIcon: Record<ActivityType, { Icon: Icon; className: string }> = {
  deactivation: { Icon: Prohibit, className: "text-danger" },
  "plus-grant": { Icon: SealCheck, className: "text-secondary" },
  offer: { Icon: PaperPlaneTilt, className: "text-primary" },
  "admin-access": { Icon: UserMinus, className: "text-muted-foreground" },
};

const activityFilterOptions = ["All admins", ...initialAdmins.filter((a) => a.active).map((a) => a.name)];

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [actorFilter, setActorFilter] = useState<string>("All admins");
  const [filterOpen, setFilterOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AdminRoleChoice>("Support admin");
  const [toast, setToast] = useState<string | null>(null);

  const activeCount = admins.filter((a) => a.active).length;

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(null), 3000);
  }

  function toggleAccess(admin: Admin) {
    setAdmins((current) =>
      current.map((a) => (a.id === admin.id ? { ...a, active: !a.active } : a)),
    );
    showToast(admin.active ? `${admin.name}'s access removed` : `${admin.name}'s access restored`);
  }

  function sendInvite() {
    const email = inviteEmail.trim();
    if (!email) return;
    showToast(`Invite sent to ${email}`);
    setInviteEmail("");
    setInviteRole("Support admin");
  }

  const filteredActivity =
    actorFilter === "All admins" ? activityLog : activityLog.filter((entry) => entry.actor === actorFilter);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-4">
      <div className="flex min-w-0 flex-col gap-4">
        <section className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-primary">Admins</h2>
            <span className="text-sm text-muted-foreground">
              {activeCount} active · {admins.length} total
            </span>
          </div>

          <div className="grid grid-cols-[minmax(0,2fr)_1fr_1fr_130px] items-center gap-3 border-b border-border bg-background px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Admin</span>
            <span>Role</span>
            <span>Last Active</span>
            <span>Access</span>
          </div>

          {admins.map((admin) => (
            <div
              key={admin.id}
              className="grid grid-cols-[minmax(0,2fr)_1fr_1fr_130px] items-center gap-3 border-b border-border px-5 py-4 text-sm last:border-b-0 hover:bg-background"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {initials(admin.name)}
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium text-primary">{admin.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{admin.email}</span>
                </div>
              </div>
              <div>
                <RolePill role={admin.role} />
              </div>
              <span className="text-muted-foreground">
                {admin.active ? admin.lastActiveLabel : "Deactivated"}
              </span>
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccess(admin)}
                  className={`text-sm font-medium underline underline-offset-2 ${
                    admin.active ? "text-danger" : "text-primary"
                  }`}
                >
                  {admin.active ? "Deactivate" : "Restore"}
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-primary">Activity log</h2>
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((open) => !open)}
                className={`flex items-center gap-2.5 rounded-md border bg-surface py-2.5 pl-3.5 pr-9 text-sm text-primary transition-colors ${
                  filterOpen ? "border-primary" : "border-border hover:border-muted"
                }`}
              >
                {actorFilter}
              </button>
              {filterOpen ? (
                <CaretUp size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              ) : (
                <CaretDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              )}

              {filterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-1.5 w-max min-w-full rounded-md border border-border bg-surface p-1">
                    {activityFilterOptions.map((option) => {
                      const selected = option === actorFilter;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setActorFilter(option);
                            setFilterOpen(false);
                          }}
                          className={`flex w-full items-center gap-2.5 whitespace-nowrap rounded-sm px-3 py-2.5 text-left text-sm transition-colors ${
                            selected ? "bg-background font-medium text-primary" : "text-primary hover:bg-background"
                          }`}
                        >
                          <Check size={14} className={selected ? "text-secondary" : "text-transparent"} />
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            {filteredActivity.map((entry) => {
              const { Icon: EntryIcon, className } = activityIcon[entry.type];
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 border-b border-border px-5 py-4 text-sm last:border-b-0"
                >
                  <EntryIcon size={16} className={`shrink-0 ${className}`} />
                  <div className="flex-1">
                    <span className="font-medium text-primary">{entry.actor}</span>{" "}
                    {entry.descriptionPrefix}
                    {entry.linkedText && (
                      <>
                        {" "}
                        <span className="text-muted-foreground">{entry.linkedText}</span>
                      </>
                    )}
                    {entry.descriptionSuffix && ` ${entry.descriptionSuffix}`}
                  </div>
                  <span className="shrink-0 text-sm text-muted">{entry.timestampLabel}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-primary">Invite an admin</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            They&apos;ll get an email invite. Access starts once they sign in.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="invite-email" className="text-sm font-medium text-primary">
            Work email
          </label>
          <input
            id="invite-email"
            type="email"
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            placeholder="name@dhan.app"
            className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-primary">Role</span>

          <button
            type="button"
            onClick={() => setInviteRole("Super admin")}
            className={`flex gap-2.5 rounded-md border p-3 text-left transition-colors ${
              inviteRole === "Super admin" ? "border-primary bg-background" : "border-border bg-surface"
            }`}
          >
            <ShieldStar
              size={17}
              weight={inviteRole === "Super admin" ? "fill" : "regular"}
              className="mt-0.5 shrink-0 text-primary"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-primary">Super admin</span>
              <span className="text-sm leading-snug text-muted-foreground">
                Everything, including deactivations and admin management.
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setInviteRole("Support admin")}
            className={`flex gap-2.5 rounded-md border p-3 text-left transition-colors ${
              inviteRole === "Support admin" ? "border-primary bg-background" : "border-border bg-surface"
            }`}
          >
            <Lifebuoy
              size={17}
              weight={inviteRole === "Support admin" ? "fill" : "regular"}
              className="mt-0.5 shrink-0 text-primary"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-primary">Support admin</span>
              <span className="text-sm leading-snug text-muted-foreground">
                View customers, grant Plus, send offers. No deactivations.
              </span>
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={sendInvite}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <EnvelopeSimple size={15} />
          Send invite
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">
          <CheckCircle size={17} weight="fill" className="text-secondary" />
          {toast}
        </div>
      )}
    </div>
  );
}
