// Mock data for the Risk & Security page. Replace with real API/data-fetching
// once the backend is wired up. Dates are relative to "today" = 22 Sep 2026,
// matching the cohort snapshot used across the console's mock data.

export type ReviewStatus = "Reviewed" | "Unreviewed";
export type LoginPlatform = "iOS" | "Android" | "Web";

export type LoginAlert = {
  id: number;
  name: string;
  email: string;
  device: string;
  platform: LoginPlatform;
  city: string;
  timestampLabel: string;
  reason: string;
  status: ReviewStatus;
};

export const loginAlerts: LoginAlert[] = [
  {
    id: 1,
    name: "Priya Nair",
    email: "priya.nair@gmail.com",
    device: "iPhone 15 Pro · iOS 17.5",
    platform: "iOS",
    city: "Mumbai, India",
    timestampLabel: "Today, 9:42 AM",
    reason: "New device",
    status: "Unreviewed",
  },
  {
    id: 2,
    name: "Rohan Mehta",
    email: "rohan.mehta@outlook.com",
    device: "OnePlus 12 · Android 14",
    platform: "Android",
    city: "Bengaluru, India",
    timestampLabel: "Yesterday, 11:05 PM",
    reason: "Unusual location",
    status: "Unreviewed",
  },
  {
    id: 3,
    name: "Neha Iyer",
    email: "neha.iyer@yahoo.in",
    device: "Chrome · Windows 11",
    platform: "Web",
    city: "Delhi, India",
    timestampLabel: "20 Sep, 6:18 PM",
    reason: "Multiple failed attempts",
    status: "Reviewed",
  },
  {
    id: 4,
    name: "Aditya Kulkarni",
    email: "aditya.k@gmail.com",
    device: "Galaxy S23 · Android 13",
    platform: "Android",
    city: "Pune, India",
    timestampLabel: "19 Sep, 2:47 AM",
    reason: "New device",
    status: "Reviewed",
  },
  {
    id: 5,
    name: "Sanya Kapoor",
    email: "sanya.kapoor@gmail.com",
    device: "iPhone 13 · iOS 17.2",
    platform: "iOS",
    city: "Hyderabad, India",
    timestampLabel: "17 Sep, 8:11 AM",
    reason: "Unusual location",
    status: "Unreviewed",
  },
];

export type DeletionStatus = "Pending" | "Processing" | "Completed";

export type DeletionRequest = {
  id: number;
  name: string;
  email: string;
  requestDateLabel: string;
  status: DeletionStatus;
};

export const deletionRequests: DeletionRequest[] = [
  {
    id: 1,
    name: "Imran Shaikh",
    email: "imran.shaikh@gmail.com",
    requestDateLabel: "20 Sep 2026",
    status: "Pending",
  },
  {
    id: 2,
    name: "Divya Reddy",
    email: "divya.reddy@gmail.com",
    requestDateLabel: "16 Sep 2026",
    status: "Processing",
  },
  {
    id: 3,
    name: "Farhan Qureshi",
    email: "farhan.q@gmail.com",
    requestDateLabel: "12 Sep 2026",
    status: "Pending",
  },
  {
    id: 4,
    name: "Tara Menon",
    email: "tara.menon@gmail.com",
    requestDateLabel: "9 Sep 2026",
    status: "Completed",
  },
];
