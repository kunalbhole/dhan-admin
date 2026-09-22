"use client";

import { useState } from "react";
import {
  AndroidLogo,
  AppleLogo,
  Check,
  CheckCircle,
  Database,
  Desktop,
  Warning,
} from "@phosphor-icons/react";
import {
  deletionRequests as initialDeletionRequests,
  loginAlerts as initialLoginAlerts,
  type DeletionRequest,
  type DeletionStatus,
  type LoginAlert,
  type LoginPlatform,
  type ReviewStatus,
} from "@/lib/risk-security-data";

type AlertFilter = "All" | ReviewStatus;

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function PlatformIcon({ platform }: { platform: LoginPlatform }) {
  if (platform === "iOS") return <AppleLogo size={15} />;
  if (platform === "Android") return <AndroidLogo size={15} />;
  return <Desktop size={15} />;
}

function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const isReviewed = status === "Reviewed";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm ${isReviewed ? "text-success" : "text-warning"}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isReviewed ? "bg-success" : "bg-warning"}`} />
      {status}
    </span>
  );
}

function DeletionStatusBadge({ status }: { status: DeletionStatus }) {
  const className =
    status === "Completed"
      ? "bg-success-surface text-success"
      : status === "Processing"
        ? "bg-primary-surface text-primary"
        : "bg-secondary-surface text-secondary-foreground";
  return (
    <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-sm font-medium ${className}`}>
      {status}
    </span>
  );
}

export default function RiskSecurityPage() {
  const [alerts, setAlerts] = useState<LoginAlert[]>(initialLoginAlerts);
  const [alertFilter, setAlertFilter] = useState<AlertFilter>("All");
  const [requests, setRequests] = useState<DeletionRequest[]>(initialDeletionRequests);
  const [confirmTarget, setConfirmTarget] = useState<DeletionRequest | null>(null);

  const unreviewedCount = alerts.filter((alert) => alert.status === "Unreviewed").length;
  const reviewedCount = alerts.length - unreviewedCount;

  const tabs: { key: AlertFilter; label: string; count: number }[] = [
    { key: "All", label: "All", count: alerts.length },
    { key: "Unreviewed", label: "Unreviewed", count: unreviewedCount },
    { key: "Reviewed", label: "Reviewed", count: reviewedCount },
  ];

  const filteredAlerts =
    alertFilter === "All" ? alerts : alerts.filter((alert) => alert.status === alertFilter);

  function markReviewed(id: number) {
    setAlerts((current) =>
      current.map((alert) => (alert.id === id ? { ...alert, status: "Reviewed" } : alert)),
    );
  }

  function confirmProcessed() {
    if (!confirmTarget) return;
    setRequests((current) =>
      current.map((request) =>
        request.id === confirmTarget.id ? { ...request, status: "Completed" } : request,
      ),
    );
    setConfirmTarget(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-semibold text-primary">Suspicious login alerts</h2>
            <p className="text-sm text-muted-foreground">
              Flagged by device and location heuristics. City-level only — precise location isn&apos;t
              stored.
            </p>
          </div>
          <div className="flex flex-1 justify-end">
            <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setAlertFilter(tab.key)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition-colors ${
                    alertFilter === tab.key
                      ? "bg-primary font-medium text-primary-foreground"
                      : "text-muted-foreground hover:bg-surface"
                  }`}
                >
                  {tab.label}
                  <span className="tabular-nums opacity-70">{tab.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.3fr)_minmax(0,1.1fr)_140px_minmax(0,1.3fr)_170px] items-center gap-3 border-b border-border bg-background px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Customer</span>
          <span>Device / Platform</span>
          <span>Location</span>
          <span>Timestamp</span>
          <span>Risk Reason</span>
          <span>Status</span>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <CheckCircle size={28} className="text-muted" />
            <span className="text-sm font-medium text-primary">Nothing in this queue</span>
            <span className="max-w-sm text-sm text-muted-foreground">
              No alerts with this status right now.
            </span>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.3fr)_minmax(0,1.1fr)_140px_minmax(0,1.3fr)_170px] items-center gap-3 border-b border-border px-5 py-4 text-sm last:border-b-0 hover:bg-background"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-surface text-xs font-semibold text-primary">
                  {initials(alert.name)}
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium text-primary">{alert.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{alert.email}</span>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
                <PlatformIcon platform={alert.platform} />
                <span className="truncate">{alert.device}</span>
              </div>
              <span className="text-muted-foreground">{alert.city}</span>
              <span className="text-muted-foreground tabular-nums">{alert.timestampLabel}</span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Warning size={15} className="shrink-0 text-warning" />
                <span>{alert.reason}</span>
              </div>
              <div className="flex flex-col items-start gap-1.5">
                <ReviewStatusBadge status={alert.status} />
                {alert.status === "Unreviewed" && (
                  <button
                    type="button"
                    onClick={() => markReviewed(alert.id)}
                    className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-primary hover:bg-surface"
                  >
                    <Check size={11} weight="bold" />
                    Mark reviewed
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        <div className="border-t border-border px-5 py-4 text-sm text-muted-foreground">
          Reviewing an alert only clears the flag. Sign-out and device revocation happen from the
          customer&apos;s profile.
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="flex flex-col gap-0.5 border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-primary">Data deletion requests</h2>
          <p className="text-sm text-muted-foreground">
            Independent from account deactivation — hard deletion requests only.
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,1.8fr)_160px_140px_190px] items-center gap-3 border-b border-border bg-background px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Customer</span>
          <span>Request Date</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {requests.map((request) => (
          <div
            key={request.id}
            className="grid grid-cols-[minmax(0,1.8fr)_160px_140px_190px] items-center gap-3 border-b border-border px-5 py-4 text-sm last:border-b-0 hover:bg-background"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-surface text-xs font-semibold text-primary">
                {initials(request.name)}
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium text-primary">{request.name}</span>
                <span className="truncate text-xs text-muted-foreground">{request.email}</span>
              </div>
            </div>
            <span className="text-muted-foreground tabular-nums">{request.requestDateLabel}</span>
            <div>
              <DeletionStatusBadge status={request.status} />
            </div>
            <div>
              {request.status === "Completed" ? (
                <span className="text-sm text-muted-foreground">Processed</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmTarget(request)}
                  className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-primary hover:bg-surface"
                >
                  <Check size={14} />
                  Mark processed
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="border-t border-border px-5 py-4 text-sm text-muted-foreground">
          Erasure is carried out by engineering within 30 days of the request. Marking a request
          processed records the outcome here.
        </div>
      </section>

      {confirmTarget && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-primary/50"
          onClick={() => setConfirmTarget(null)}
        >
          <div
            className="flex w-[440px] flex-col gap-4 rounded-lg bg-surface p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-surface">
              <Database size={20} className="text-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-semibold text-primary">
                Mark this deletion request as processed?
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Confirm that engineering has erased {confirmTarget.name}&apos;s server-side records.
                The request moves to Completed and is stamped with today&apos;s date.
              </p>
            </div>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-primary hover:bg-background"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmProcessed}
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <Check size={15} weight="bold" />
                Mark processed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
