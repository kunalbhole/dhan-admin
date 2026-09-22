"use client";

import { useState, type ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";
import {
  Bell,
  IdentificationCard,
  Lifebuoy,
  LockSimple,
  UserMinus,
  UserPlus,
} from "@phosphor-icons/react";
import { admins } from "@/lib/admins-data";

type PrefKey = "signup" | "cancellation" | "support" | "kyc";

type Pref = {
  key: PrefKey;
  label: string;
  description: string;
  icon: Icon;
  iconClassName: string;
};

const preferences: Pref[] = [
  {
    key: "signup",
    label: "New signups",
    description: "Notify when a new customer signs up",
    icon: UserPlus,
    iconClassName: "bg-success-surface text-success",
  },
  {
    key: "cancellation",
    label: "Plus cancellations",
    description: "Notify when a subscriber cancels",
    icon: UserMinus,
    iconClassName: "bg-danger-surface text-danger",
  },
  {
    key: "support",
    label: "Support requests",
    description: "Notify on new pending support tickets",
    icon: Lifebuoy,
    iconClassName: "bg-warning/10 text-warning",
  },
  {
    key: "kyc",
    label: "KYC exceptions",
    description: "Notify when a case needs manual review",
    icon: IdentificationCard,
    iconClassName: "bg-primary-surface text-primary",
  },
];

const defaultPrefState: Record<PrefKey, boolean> = {
  signup: true,
  cancellation: true,
  support: true,
  kyc: false,
};

const planRows = [
  { label: "Plus — monthly", description: "Shown in-app on the upgrade sheet", value: "₹199" },
  { label: "Plus — yearly", description: "2 months free", value: "₹1,990" },
  { label: "Free trial length", description: "Applied to new signups", value: "14 days" },
];

function SettingsCard({
  title,
  right,
  children,
}: {
  title: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between gap-4 border-b border-border px-8 py-5">
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

export default function SettingsPage() {
  const [consoleName, setConsoleName] = useState("Dhan admin console");
  const [supportInbox, setSupportInbox] = useState("help@dhan.app");
  const [prefs, setPrefs] = useState(defaultPrefState);

  const currentAdmin = admins[0]?.name ?? "the current admin";
  const enabledCount = Object.values(prefs).filter(Boolean).length;

  function togglePref(key: PrefKey) {
    setPrefs((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <div className="mx-auto flex max-w-[920px] flex-col gap-8">
      <SettingsCard title="Workspace">
        <div className="grid grid-cols-2 gap-6 p-8">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-primary">Console name</span>
            <input
              type="text"
              value={consoleName}
              onChange={(event) => setConsoleName(event.target.value)}
              className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-primary focus:outline-none focus:border-primary"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-primary">Support inbox</span>
            <input
              type="email"
              value={supportInbox}
              onChange={(event) => setSupportInbox(event.target.value)}
              className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-primary focus:outline-none focus:border-primary"
            />
          </label>
        </div>
      </SettingsCard>

      <SettingsCard title="Plans & pricing">
        <div className="flex flex-col divide-y divide-border p-8">
          {planRows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 py-5 text-sm first:pt-0 last:pb-0"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-primary">{row.label}</span>
                <span className="text-sm text-muted-foreground">{row.description}</span>
              </div>
              <span className="font-semibold text-primary tabular-nums">{row.value}</span>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Notification preferences"
        right={
          <span className="text-sm text-muted-foreground">
            {enabledCount} of {preferences.length} enabled
          </span>
        }
      >
        <div className="flex flex-col p-8">
          <div className="flex flex-col divide-y divide-border">
            {preferences.map((pref) => {
              const PrefIcon = pref.icon;
              const enabled = prefs[pref.key];
              return (
                <div key={pref.key} className="flex items-center gap-4 py-5 first:pt-0 last:pb-0">
                  <div
                    className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md ${pref.iconClassName}`}
                  >
                    <PrefIcon size={16} weight="bold" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-sm font-medium text-primary">{pref.label}</span>
                    <span className="text-sm text-muted-foreground">{pref.description}</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    aria-label={pref.label}
                    onClick={() => togglePref(pref.key)}
                    className={`flex h-[26px] w-11 shrink-0 items-center rounded-full p-[3px] transition-colors duration-150 ${
                      enabled ? "bg-primary" : "bg-border"
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full bg-surface transition-transform duration-200 ease-out ${
                        enabled ? "translate-x-[18px]" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-start gap-2.5 rounded-md bg-background p-4">
            <Bell size={15} className="mt-0.5 shrink-0 text-muted-foreground" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              These settings only change what {currentAdmin} sees in the console bell. Every event
              is still recorded in the activity log.
            </p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Data access">
        <div className="flex gap-4 p-8">
          <LockSimple size={18} className="mt-0.5 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Dhan is local-first. Transactions, budgets and bills live on the user&apos;s device and
            back up as an encrypted snapshot to their own Google Drive or iCloud. This console can
            only read account and subscription metadata — no admin, including super admins, can
            view a customer&apos;s financial data.
          </p>
        </div>
      </SettingsCard>
    </div>
  );
}
