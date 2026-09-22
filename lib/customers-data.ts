// Mock data for the Customers page. Replace with real API/data-fetching
// once the backend is wired up. Dates are relative to "today" = 22 Sep 2026,
// matching the cohort snapshot used across the console's mock data.

export type Plan = "Free" | "Plus";
export type Status = "Active" | "Inactive" | "Suspended" | "Deactivated";
export type Platform = "iOS" | "Android";

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  /** ISO date, used for signed-up date filtering/sorting. */
  signupDate: string;
  signupLabel: string;
  plan: Plan;
  status: Status;
  lastActiveLabel: string;
  /** Days since last opened the app, used for last-active filtering. */
  lastActiveDaysAgo: number;
  platform: Platform;
  /** True if the customer cancelled a Plus subscription recently. */
  recentlyCancelledPlus?: boolean;
};

export const customers: Customer[] = [
  {
    id: 1,
    name: "Priya Nair",
    email: "priya.nair@gmail.com",
    phone: "+91 98200 41122",
    signupDate: "2026-09-18",
    signupLabel: "18 Sep 2026",
    plan: "Plus",
    status: "Active",
    lastActiveLabel: "2 hours ago",
    lastActiveDaysAgo: 0,
    platform: "iOS",
  },
  {
    id: 2,
    name: "Rohan Mehta",
    email: "rohan.mehta@outlook.com",
    phone: "+91 99303 88210",
    signupDate: "2026-08-30",
    signupLabel: "30 Aug 2026",
    plan: "Plus",
    status: "Active",
    lastActiveLabel: "Today",
    lastActiveDaysAgo: 0,
    platform: "Android",
  },
  {
    id: 3,
    name: "Ananya Sharma",
    email: "ananya.s@gmail.com",
    phone: "+91 97110 20934",
    signupDate: "2026-09-20",
    signupLabel: "20 Sep 2026",
    plan: "Free",
    status: "Active",
    lastActiveLabel: "18 min ago",
    lastActiveDaysAgo: 0,
    platform: "iOS",
  },
  {
    id: 4,
    name: "Vikram Rao",
    email: "vikram.rao@gmail.com",
    phone: "+91 90040 77451",
    signupDate: "2026-09-16",
    signupLabel: "16 Sep 2026",
    plan: "Free",
    status: "Active",
    lastActiveLabel: "Yesterday",
    lastActiveDaysAgo: 1,
    platform: "Android",
  },
  {
    id: 5,
    name: "Neha Iyer",
    email: "neha.iyer@yahoo.in",
    phone: "+91 88790 13366",
    signupDate: "2026-01-18",
    signupLabel: "18 Jan 2026",
    plan: "Free",
    status: "Inactive",
    lastActiveLabel: "23 days ago",
    lastActiveDaysAgo: 23,
    platform: "iOS",
    recentlyCancelledPlus: true,
  },
  {
    id: 6,
    name: "Meera Nair",
    email: "meera.n@gmail.com",
    phone: "+91 96450 90021",
    signupDate: "2026-02-27",
    signupLabel: "27 Feb 2026",
    plan: "Plus",
    status: "Active",
    lastActiveLabel: "4 hours ago",
    lastActiveDaysAgo: 0,
    platform: "Android",
  },
  {
    id: 7,
    name: "Aditya Kulkarni",
    email: "aditya.k@gmail.com",
    phone: "+91 93220 55870",
    signupDate: "2026-05-09",
    signupLabel: "9 May 2026",
    plan: "Free",
    status: "Active",
    lastActiveLabel: "3 days ago",
    lastActiveDaysAgo: 3,
    platform: "Android",
  },
  {
    id: 8,
    name: "Sanya Kapoor",
    email: "sanya.kapoor@gmail.com",
    phone: "+91 98991 40025",
    signupDate: "2026-06-21",
    signupLabel: "21 Jun 2026",
    plan: "Plus",
    status: "Active",
    lastActiveLabel: "Today",
    lastActiveDaysAgo: 0,
    platform: "iOS",
  },
  {
    id: 9,
    name: "Imran Shaikh",
    email: "imran.shaikh@gmail.com",
    phone: "+91 82910 66743",
    signupDate: "2026-07-14",
    signupLabel: "14 Jul 2026",
    plan: "Free",
    status: "Suspended",
    lastActiveLabel: "12 days ago",
    lastActiveDaysAgo: 12,
    platform: "Android",
  },
  {
    id: 10,
    name: "Tara Menon",
    email: "tara.menon@gmail.com",
    phone: "+91 90876 22119",
    signupDate: "2026-07-30",
    signupLabel: "30 Jul 2026",
    plan: "Free",
    status: "Active",
    lastActiveLabel: "Yesterday",
    lastActiveDaysAgo: 1,
    platform: "iOS",
  },
  {
    id: 11,
    name: "Karan Bhatia",
    email: "karan.b@gmail.com",
    phone: "+91 99871 30052",
    signupDate: "2026-08-08",
    signupLabel: "8 Aug 2026",
    plan: "Plus",
    status: "Active",
    lastActiveLabel: "6 hours ago",
    lastActiveDaysAgo: 0,
    platform: "Android",
  },
  {
    id: 12,
    name: "Divya Reddy",
    email: "divya.reddy@gmail.com",
    phone: "+91 94400 71238",
    signupDate: "2026-08-25",
    signupLabel: "25 Aug 2026",
    plan: "Free",
    status: "Deactivated",
    lastActiveLabel: "Deactivated 5 Sep",
    lastActiveDaysAgo: 17,
    platform: "iOS",
  },
  {
    id: 13,
    name: "Farhan Qureshi",
    email: "farhan.q@gmail.com",
    phone: "+91 91670 44508",
    signupDate: "2026-02-11",
    signupLabel: "11 Feb 2026",
    plan: "Free",
    status: "Inactive",
    lastActiveLabel: "95 days ago",
    lastActiveDaysAgo: 95,
    platform: "Android",
    recentlyCancelledPlus: true,
  },
];
