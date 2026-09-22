// Mock data for the Offers & announcements page. Replace with real
// API/data-fetching once the backend is wired up. Dates are relative to
// "today" = 23 Sep 2026, matching the cohort snapshot used across the
// console's mock data.

export type ComposeTab = "offer" | "announcement";

export type Audience = "All users" | "Free users" | "Plus users" | "Custom segment";

export const AUDIENCE_SIZE: Record<Exclude<Audience, "Custom segment">, number> = {
  "All users": 104,
  "Free users": 81,
  "Plus users": 23,
};

export type HistoryStatus = "Sent" | "Ended" | "Scheduled";

export type HistoryEntry = {
  id: number;
  message: string;
  type: string;
  audienceLabel: string;
  sentLabel: string;
  seen: number | null;
  tapped: number | null;
  status: HistoryStatus;
};

export const historyEntries: HistoryEntry[] = [
  {
    id: 1,
    message: "Two months of Plus, on us",
    type: "Offer",
    audienceLabel: "Free users · 78",
    sentLabel: "28 Aug",
    seen: 61,
    tapped: 14,
    status: "Sent",
  },
  {
    id: 2,
    message: "Backup your data before you switch phones",
    type: "Announcement · banner",
    audienceLabel: "All users · 98",
    sentLabel: "21 Aug",
    seen: 88,
    tapped: 31,
    status: "Ended",
  },
  {
    id: 3,
    message: "Independence week — ₹99 for 3 months",
    type: "Offer",
    audienceLabel: "Custom · 34",
    sentLabel: "14 Aug",
    seen: 29,
    tapped: 9,
    status: "Sent",
  },
  {
    id: 4,
    message: "New: split bills with contacts",
    type: "Announcement · modal",
    audienceLabel: "Plus users · 21",
    sentLabel: "6 Sep",
    seen: null,
    tapped: null,
    status: "Scheduled",
  },
];
