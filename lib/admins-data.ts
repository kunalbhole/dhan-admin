// Mock data for the Admins page. Replace with real API/data-fetching once the
// backend is wired up. Dates are relative to "today" = 22 Sep 2026, matching
// the cohort snapshot used across the console's mock data.

export type AdminRole = "Super admin" | "Support admin";

export type Admin = {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  lastActiveLabel: string;
  active: boolean;
};

export const admins: Admin[] = [
  // Note: admins[0] is treated as the signed-in admin (see `currentAdmin`
  // below) — keep them first if the roster order ever changes.
  {
    id: 1,
    name: "Priya Desai",
    email: "priya@dhan.app",
    role: "Super admin",
    lastActiveLabel: "Now",
    active: true,
  },
  {
    id: 2,
    name: "Kabir Anand",
    email: "kabir@dhan.app",
    role: "Support admin",
    lastActiveLabel: "Yesterday",
    active: true,
  },
  {
    id: 3,
    name: "Sana Qureshi",
    email: "sana@dhan.app",
    role: "Support admin",
    lastActiveLabel: "3 days ago",
    active: true,
  },
  {
    id: 4,
    name: "Tarun Bhatt",
    email: "tarun@dhan.app",
    role: "Support admin",
    lastActiveLabel: "Deactivated",
    active: false,
  },
];

// The signed-in admin shown across the console (topbar, settings copy, etc).
export const currentAdmin: Admin = admins[0];

export type ActivityType = "deactivation" | "plus-grant" | "offer" | "admin-access";

export type ActivityEntry = {
  id: number;
  type: ActivityType;
  actor: string;
  descriptionPrefix: string;
  linkedText?: string;
  descriptionSuffix?: string;
  timestampLabel: string;
};

export const activityLog: ActivityEntry[] = [
  {
    id: 1,
    type: "deactivation",
    actor: "Priya Desai",
    descriptionPrefix: "deactivated account",
    linkedText: "arjun.k@gmail.com",
    timestampLabel: "Today, 11:04",
  },
  {
    id: 2,
    type: "plus-grant",
    actor: "Kabir Anand",
    descriptionPrefix: "granted Plus to",
    linkedText: "Meera Nair",
    descriptionSuffix: "— 3 months, goodwill",
    timestampLabel: "Yesterday, 18:22",
  },
  {
    id: 3,
    type: "offer",
    actor: "Priya Desai",
    descriptionPrefix: 'sent offer "Two months of Plus, on us" to 78 free users',
    timestampLabel: "28 Aug, 10:10",
  },
  {
    id: 4,
    type: "admin-access",
    actor: "Priya Desai",
    descriptionPrefix: "deactivated admin access for",
    linkedText: "tarun@dhan.app",
    timestampLabel: "22 Aug, 09:47",
  },
];
