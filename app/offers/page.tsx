"use client";

import { useState } from "react";
import type { Icon } from "@phosphor-icons/react";
import {
  CheckCircle,
  Clock,
  Funnel,
  MonitorPlay,
  PaperPlaneTilt,
  SealCheck,
  Tag,
  User,
  Users,
} from "@phosphor-icons/react";
import {
  AUDIENCE_SIZE,
  historyEntries as initialHistoryEntries,
  type Audience,
  type ComposeTab,
  type HistoryEntry,
  type HistoryStatus,
} from "@/lib/offers-data";

const TODAY = "2026-09-23";
const DEFAULT_END = "2026-10-07";

const TABS: { key: ComposeTab; label: string; icon: Icon }[] = [
  { key: "offer", label: "Offer message", icon: Tag },
  { key: "announcement", label: "In-app announcement", icon: MonitorPlay },
];

const AUDIENCE_OPTIONS: { value: Audience; icon: Icon }[] = [
  { value: "All users", icon: Users },
  { value: "Free users", icon: User },
  { value: "Plus users", icon: SealCheck },
  { value: "Custom segment", icon: Funnel },
];

const STATUS_PILL_CLASSNAME: Record<HistoryStatus, string> = {
  Sent: "bg-success-surface text-success",
  Ended: "border border-border bg-background text-muted-foreground",
  Scheduled: "bg-secondary-surface text-secondary-foreground",
};

function audiencePillLabel(audience: Audience): string {
  if (audience === "Custom segment") return "Custom segment";
  return `${audience} · ${AUDIENCE_SIZE[audience]}`;
}

function audienceCountLabel(audience: Audience): string {
  if (audience === "Custom segment") return "your custom segment";
  if (audience === "All users") return `all ${AUDIENCE_SIZE[audience]} users`;
  if (audience === "Free users") return `${AUDIENCE_SIZE[audience]} free users`;
  return `${AUDIENCE_SIZE[audience]} Plus users`;
}

function historyAudienceLabel(audience: Audience): string {
  if (audience === "Custom segment") return "Custom segment";
  return `${audience} · ${AUDIENCE_SIZE[audience]}`;
}

function formatShortDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(
    new Date(year, month - 1, day),
  );
}

function StatusPill({ status }: { status: HistoryStatus }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full px-2.5 text-sm font-medium ${STATUS_PILL_CLASSNAME[status]}`}
    >
      {status}
    </span>
  );
}

export default function OffersPage() {
  const [activeTab, setActiveTab] = useState<ComposeTab>("offer");
  const [audience, setAudience] = useState<Audience>("Free users");
  const [headline, setHeadline] = useState("");
  const [message, setMessage] = useState("");
  const [sendOn, setSendOn] = useState(TODAY);
  const [endsOn, setEndsOn] = useState(DEFAULT_END);
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistoryEntries);
  const [toast, setToast] = useState<string | null>(null);

  const isOfferTab = activeTab === "offer";
  const composerTitle = isOfferTab ? "New offer message" : "New in-app announcement";
  const headlineLabel = isOfferTab ? "Offer headline" : "Announcement headline";
  const headlinePlaceholder = isOfferTab
    ? "Two months of Plus, on us"
    : "New: split bills with contacts";
  const previewMode = isOfferTab ? "OFFER CARD · IOS" : "ANNOUNCEMENT · IOS";
  const previewEyebrow = isOfferTab ? "OFFER FOR YOU" : "ANNOUNCEMENT";
  const previewCta = isOfferTab ? "Claim offer" : "Got it";

  const canSubmit = headline.trim() !== "" && message.trim() !== "";

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(null), 3000);
  }

  function pushHistoryEntry(status: HistoryStatus) {
    const entry: HistoryEntry = {
      id: Math.max(0, ...history.map((h) => h.id)) + 1,
      message: headline.trim(),
      type: isOfferTab ? "Offer" : "Announcement · banner",
      audienceLabel: historyAudienceLabel(audience),
      sentLabel: status === "Scheduled" ? formatShortDate(sendOn) : formatShortDate(TODAY),
      seen: status === "Scheduled" ? null : 0,
      tapped: status === "Scheduled" ? null : 0,
      status,
    };
    setHistory((current) => [entry, ...current]);
    setHeadline("");
    setMessage("");
  }

  function handleSendNow() {
    if (!canSubmit) return;
    pushHistoryEntry("Sent");
    showToast(`${isOfferTab ? "Offer" : "Announcement"} sent to ${audienceCountLabel(audience)}`);
  }

  function handleSchedule() {
    if (!canSubmit) return;
    pushHistoryEntry("Scheduled");
    showToast(
      `${isOfferTab ? "Offer" : "Announcement"} scheduled for ${formatShortDate(sendOn)} — reaches ${audienceCountLabel(audience)}`,
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex w-fit items-center gap-1 self-start rounded-md border border-border bg-surface p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm transition-colors ${
              activeTab === tab.key
                ? "bg-primary font-medium text-primary-foreground"
                : "text-muted-foreground hover:bg-background"
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-4">
        <div className="rounded-lg border border-border bg-surface">
          <div className="border-b border-border px-5 py-4 text-base font-semibold text-primary">
            {composerTitle}
          </div>
          <div className="flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-primary">Audience</span>
              <div className="flex flex-wrap gap-2">
                {AUDIENCE_OPTIONS.map((option) => {
                  const selected = audience === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setAudience(option.value)}
                      className={`flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm transition-colors ${
                        selected
                          ? "border-primary bg-primary font-medium text-primary-foreground"
                          : "border-border bg-surface text-primary hover:bg-background"
                      }`}
                    >
                      <option.icon size={14} />
                      {audiencePillLabel(option.value)}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-primary">{headlineLabel}</span>
              <input
                type="text"
                value={headline}
                onChange={(event) => setHeadline(event.target.value)}
                placeholder={headlinePlaceholder}
                className="rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-primary placeholder:text-muted focus:border-primary focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-primary">Message</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                maxLength={180}
                placeholder="Keep it short and warm — one sentence and a CTA works best."
                className="resize-none rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-primary placeholder:text-muted focus:border-primary focus:outline-none"
              />
              <span className="text-sm text-muted">{message.length} / 180 characters</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-primary">Send on</span>
                <input
                  type="date"
                  value={sendOn}
                  onChange={(event) => setSendOn(event.target.value)}
                  className="rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-primary focus:border-primary focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-primary">Ends</span>
                <input
                  type="date"
                  value={endsOn}
                  onChange={(event) => setEndsOn(event.target.value)}
                  className="rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-primary focus:border-primary focus:outline-none"
                />
              </label>
            </div>

            <div className="flex items-center gap-2.5 border-t border-border pt-4">
              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleSendNow}
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:opacity-40"
              >
                <PaperPlaneTilt size={15} weight="bold" />
                Send now
              </button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleSchedule}
                className="flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-primary hover:bg-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <Clock size={15} />
                Schedule
              </button>
              <span className="flex-1" />
              <span className="text-sm text-muted-foreground">
                Reaches {audienceCountLabel(audience)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="text-base font-semibold text-primary">Preview</span>
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {previewMode}
            </span>
          </div>
          <div className="flex justify-center rounded-b-lg bg-background p-5">
            <div className="w-[264px] overflow-hidden rounded-lg border border-border bg-surface">
              <div className="flex h-7 items-center justify-between bg-primary px-3">
                <span className="text-xs text-primary-foreground/85">9:41</span>
                <span className="text-xs text-primary-foreground/85">Dhan</span>
              </div>
              <div className="flex min-h-[300px] flex-col gap-3 p-3.5">
                <div className="flex flex-col gap-1.5 rounded-lg bg-primary p-3.5">
                  <div className="flex items-center gap-1.5">
                    <SealCheck size={13} weight="fill" className="text-secondary" />
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-secondary">
                      {previewEyebrow}
                    </span>
                  </div>
                  <div className="text-base font-semibold leading-snug text-primary-foreground">
                    {headline.trim() || "Your headline shows here"}
                  </div>
                  <div className="text-sm leading-relaxed text-primary-foreground/70">
                    {message.trim() || "Your message shows here."}
                  </div>
                  <div className="mt-1.5 flex h-9 items-center justify-center rounded-md bg-secondary text-sm font-semibold text-secondary-foreground">
                    {previewCta}
                  </div>
                </div>
                <div className="h-14 rounded-lg bg-background" />
                <div className="h-14 rounded-lg bg-background" />
                <div className="h-14 rounded-lg bg-background" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="text-base font-semibold text-primary">History</span>
          <span className="text-sm text-muted-foreground">
            {history.length} sent in the last 90 days
          </span>
        </div>

        <div className="grid grid-cols-[minmax(0,2fr)_1fr_1fr_100px_120px_100px] items-center gap-3 border-b border-border bg-background px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Message</span>
          <span>Type</span>
          <span>Audience</span>
          <span>Sent</span>
          <span>Seen / Tapped</span>
          <span>Status</span>
        </div>

        {history.map((entry) => (
          <div
            key={entry.id}
            className="grid grid-cols-[minmax(0,2fr)_1fr_1fr_100px_120px_100px] items-center gap-3 border-b border-border px-5 py-4 text-sm last:border-b-0 hover:bg-background"
          >
            <span className="truncate font-medium text-primary">{entry.message}</span>
            <span className="text-muted-foreground">{entry.type}</span>
            <span className="text-muted-foreground">{entry.audienceLabel}</span>
            <span className="text-muted-foreground tabular-nums">{entry.sentLabel}</span>
            <span className="text-muted-foreground tabular-nums">
              {entry.seen === null || entry.tapped === null ? "—" : `${entry.seen} · ${entry.tapped}`}
            </span>
            <div>
              <StatusPill status={entry.status} />
            </div>
          </div>
        ))}
      </section>

      {toast && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">
          <CheckCircle size={17} weight="fill" className="text-secondary" />
          {toast}
        </div>
      )}
    </div>
  );
}
