// Mock data for the Overview page. Replace with real API/data-fetching
// once the backend is wired up.

export const TOTAL_USERS = 104;

export const overviewMetrics = {
  totalUsers: {
    value: 104,
    subtext: "+6 this week",
    note: "excludes 2 deactivated",
  },
  plusSubscribers: {
    value: 23,
    subtext: "₹4,577 MRR",
  },
  churnRate: {
    value: "4.3%",
    subtext: "1 cancellation",
  },
  newSignups: {
    value: 2,
    subtext: "today · 6 this week",
  },
  pendingSupport: {
    value: 3,
    subtext: "oldest 2 days",
  },
  deactivatedAccounts: {
    value: 2,
    subtext: "1 this month",
  },
};

export type ActivityType = "signup" | "upgrade" | "cancel" | "admin";

export const recentActivity: Array<{
  id: number;
  name: string;
  description: string;
  timestamp: string;
  type: ActivityType;
}> = [
  {
    id: 1,
    name: "Ananya Sharma",
    description: "signed up on iOS",
    timestamp: "18 min ago",
    type: "signup",
  },
  {
    id: 2,
    name: "Rohan Mehta",
    description: "upgraded to Plus — ₹199/mo",
    timestamp: "2 hours ago",
    type: "upgrade",
  },
  {
    id: 3,
    name: "Neha Iyer",
    description: 'cancelled Plus — reason: "not using it"',
    timestamp: "5 hours ago",
    type: "cancel",
  },
  {
    id: 4,
    name: "Kabir (support)",
    description: "granted Plus manually to Meera Nair",
    timestamp: "Yesterday",
    type: "admin",
  },
  {
    id: 5,
    name: "Vikram Rao",
    description: "signed up on Android",
    timestamp: "Yesterday",
    type: "signup",
  },
];

export const planMix = {
  free: 81,
  plus: 23,
};
