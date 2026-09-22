"use client";

import { Bell, MagnifyingGlass } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-items";
import { TOTAL_USERS } from "@/lib/overview-data";

function formatOverviewDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function Topbar() {
  const pathname = usePathname();
  const isOverview = pathname === "/";
  const isCustomers = pathname === "/customers";
  const isRiskSecurity = pathname === "/risk-security";
  const isOffers = pathname === "/offers";
  const isAdmins = pathname === "/admins";
  const title = isOffers
    ? "Offers & announcements"
    : (navItems.find((item) => item.href === pathname)?.label ?? "Dhan Admin");

  return (
    <header className="flex min-h-[72px] shrink-0 items-center justify-between border-b border-border bg-surface px-6 py-3">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-xl font-semibold text-primary">{title}</h1>
        {isOverview && (
          <p className="text-sm text-muted-foreground">
            {formatOverviewDate(new Date())} · cohort of {TOTAL_USERS} users
          </p>
        )}
        {isCustomers && (
          <p className="text-sm text-muted-foreground">Account and subscription metadata only</p>
        )}
        {isRiskSecurity && (
          <p className="text-sm text-muted-foreground">
            Suspicious activity and data deletion requests
          </p>
        )}
        {isOffers && (
          <p className="text-sm text-muted-foreground">
            Compose, schedule and review what users see
          </p>
        )}
        {isAdmins && (
          <p className="text-sm text-muted-foreground">Who has access, and what they&apos;ve done</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2">
          <MagnifyingGlass size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Search"
            className="w-48 bg-transparent text-sm text-primary placeholder:text-muted focus:outline-none"
          />
        </label>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-primary hover:bg-background"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-secondary" />
        </button>

        <div className="flex items-center gap-3 rounded-full border border-border py-1 pl-1 pr-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            AD
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-primary">Admin User</span>
            <span className="text-xs text-muted">Super Admin</span>
          </span>
        </div>
      </div>
    </header>
  );
}
