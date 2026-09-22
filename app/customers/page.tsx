"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AndroidLogo,
  AppleLogo,
  CaretDown,
  CaretUp,
  Check,
  DownloadSimple,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import {
  customers,
  type Customer,
  type Plan,
  type Platform,
  type Status,
} from "@/lib/customers-data";

const PAGE_SIZE = 8;
// Fixed reference date so the mock "signed up" / "last active" filters are
// stable across renders. Matches the cohort snapshot used elsewhere.
const TODAY = new Date(2026, 8, 22).getTime();
const MS_PER_DAY = 24 * 60 * 60 * 1000;

type PlanFilter = "All" | Plan;
type StatusFilter = "Any status" | Status | "Recently cancelled";
type SignupFilter = "All time" | "Last 7 days" | "Last 30 days" | "This quarter";
type LastActiveFilter =
  | "Any activity"
  | "Active in last 7 days"
  | "Active in last 30 days"
  | "Inactive 30+ days"
  | "Inactive 90+ days";
type PlatformFilter = "All platforms" | Platform;
type DropdownKey = "status" | "signup" | "lastActive" | "platform" | "sort";

const STATUS_OPTIONS: StatusFilter[] = [
  "Any status",
  "Active",
  "Inactive",
  "Suspended",
  "Deactivated",
  "Recently cancelled",
];

const SIGNUP_OPTIONS: SignupFilter[] = ["All time", "Last 7 days", "Last 30 days", "This quarter"];

const LAST_ACTIVE_OPTIONS: LastActiveFilter[] = [
  "Any activity",
  "Active in last 7 days",
  "Active in last 30 days",
  "Inactive 30+ days",
  "Inactive 90+ days",
];

const PLATFORM_OPTIONS: PlatformFilter[] = ["All platforms", "iOS", "Android"];

const SORT_OPTIONS: { value: string; disabled?: boolean }[] = [
  { value: "Default order" },
  { value: "Newest signup first", disabled: true },
  { value: "Oldest signup first", disabled: true },
  { value: "Name A–Z", disabled: true },
];

const SIGNUP_WINDOW_DAYS: Record<Exclude<SignupFilter, "All time">, number> = {
  "Last 7 days": 7,
  "Last 30 days": 30,
  "This quarter": 92,
};

const STATUS_DOT_CLASSNAME: Record<Status, string> = {
  Active: "bg-success",
  Inactive: "bg-muted",
  Suspended: "bg-danger",
  Deactivated: "bg-muted-foreground",
};

const STATUS_TEXT_CLASSNAME: Record<Status, string> = {
  Active: "text-success",
  Inactive: "text-muted",
  Suspended: "text-danger",
  Deactivated: "text-muted-foreground",
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function toCsv(rows: Customer[]) {
  const header = ["Name", "Email", "Phone", "Signed up", "Plan", "Status", "Last active", "Platform"];
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const lines = rows.map((c) =>
    [c.name, c.email, c.phone, c.signupLabel, c.plan, c.status, c.lastActiveLabel, c.platform]
      .map(escape)
      .join(","),
  );
  return [header.map(escape).join(","), ...lines].join("\n");
}

function Checkbox({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors ${
        checked ? "border-primary bg-primary" : "border-border bg-surface hover:border-muted"
      }`}
    >
      {checked && <Check size={10} weight="bold" className="text-primary-foreground" />}
    </button>
  );
}

function StatusDot({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${STATUS_TEXT_CLASSNAME[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_CLASSNAME[status]}`} />
      {status}
    </span>
  );
}

function PlanPill({ plan }: { plan: Plan }) {
  const className =
    plan === "Plus"
      ? "bg-secondary-surface text-secondary-foreground"
      : "bg-primary-surface text-primary";
  return (
    <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-sm font-medium ${className}`}>
      {plan}
    </span>
  );
}

function PlatformCell({ platform }: { platform: Platform }) {
  const PlatformIcon = platform === "iOS" ? AppleLogo : AndroidLogo;
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <PlatformIcon size={15} />
      {platform}
    </span>
  );
}

function FilterDropdown({
  value,
  options,
  onChange,
  isOpen,
  onToggle,
  align = "left",
}: {
  value: string;
  options: { value: string; disabled?: boolean }[];
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  align?: "left" | "right";
}) {
  return (
    <div className="relative min-w-[180px] flex-1">
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-[46px] w-full items-center justify-between gap-2 rounded-md border bg-surface px-4 text-sm text-primary transition-colors ${
          isOpen ? "border-primary" : "border-border hover:border-muted"
        }`}
      >
        <span className="truncate">{value}</span>
        {isOpen ? (
          <CaretUp size={14} className="shrink-0 text-muted-foreground" />
        ) : (
          <CaretDown size={14} className="shrink-0 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div
          className={`absolute top-full z-20 mt-2 w-max min-w-full max-w-[260px] rounded-md border border-border bg-surface p-1 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => {
                  if (option.disabled) return;
                  onChange(option.value);
                }}
                className={`flex w-full items-center justify-between gap-3 whitespace-nowrap rounded-sm px-3 py-2 text-left text-sm transition-colors ${
                  option.disabled
                    ? "cursor-not-allowed text-muted"
                    : selected
                      ? "bg-background font-medium text-primary"
                      : "text-primary hover:bg-background"
                }`}
              >
                {option.value}
                {option.disabled ? (
                  <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                    Soon
                  </span>
                ) : (
                  selected && <Check size={13} className="text-secondary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CustomersPage() {
  const [planFilter, setPlanFilter] = useState<PlanFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Any status");
  const [signupFilter, setSignupFilter] = useState<SignupFilter>("All time");
  const [lastActiveFilter, setLastActiveFilter] = useState<LastActiveFilter>("Any activity");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("All platforms");
  const [sortFilter, setSortFilter] = useState("Default order");
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const filterRowRef = useRef<HTMLDivElement>(null);

  // TEMP DEBUG: closes any open filter dropdown when clicking outside the
  // filter row. Logs so open/close behavior can be verified in devtools.
  // Remove this effect (and the console.log calls below) once confirmed.
  useEffect(() => {
    if (!openDropdown) return;
    function handlePointerDown(event: MouseEvent) {
      if (!filterRowRef.current) return;
      if (event.target instanceof Node && !filterRowRef.current.contains(event.target)) {
        console.log("[CustomersFilters] outside click -> closing dropdown:", openDropdown);
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [openDropdown]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      if (planFilter !== "All" && customer.plan !== planFilter) return false;

      if (statusFilter === "Recently cancelled") {
        if (!customer.recentlyCancelledPlus) return false;
      } else if (statusFilter !== "Any status" && customer.status !== statusFilter) {
        return false;
      }

      if (platformFilter !== "All platforms" && customer.platform !== platformFilter) return false;

      if (signupFilter !== "All time") {
        const windowDays = SIGNUP_WINDOW_DAYS[signupFilter];
        const signupTime = new Date(customer.signupDate).getTime();
        if (TODAY - signupTime > windowDays * MS_PER_DAY) return false;
      }

      if (lastActiveFilter !== "Any activity") {
        const days = customer.lastActiveDaysAgo;
        if (lastActiveFilter === "Active in last 7 days" && days > 7) return false;
        if (lastActiveFilter === "Active in last 30 days" && days > 30) return false;
        if (lastActiveFilter === "Inactive 30+ days" && days < 30) return false;
        if (lastActiveFilter === "Inactive 90+ days" && days < 90) return false;
      }

      return true;
    });
  }, [planFilter, statusFilter, signupFilter, lastActiveFilter, platformFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filteredCustomers.slice(pageStart, pageStart + PAGE_SIZE);
  const pageAllSelected = pageRows.length > 0 && pageRows.every((c) => selectedIds.includes(c.id));

  const chips = useMemo(() => {
    const list: { key: string; label: string; onRemove: () => void }[] = [];
    if (statusFilter === "Recently cancelled") {
      list.push({
        key: "recently-cancelled",
        label: "Recently cancelled Plus",
        onRemove: () => setStatusFilter("Any status"),
      });
    }
    return list;
  }, [statusFilter]);

  function toggleDropdown(key: DropdownKey) {
    setOpenDropdown((current) => {
      const next = current === key ? null : key;
      // TEMP DEBUG: remove once dropdown open/close is confirmed in devtools.
      console.log("[CustomersFilters] toggleDropdown:", key, "->", next ? `open (${next})` : "closed");
      return next;
    });
  }

  function toggleRow(id: number) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id],
    );
  }

  function togglePageAll() {
    setSelectedIds((current) => {
      if (pageAllSelected) {
        const pageIds = new Set(pageRows.map((c) => c.id));
        return current.filter((id) => !pageIds.has(id));
      }
      const merged = new Set(current);
      pageRows.forEach((c) => merged.add(c.id));
      return Array.from(merged);
    });
  }

  function resetFilters() {
    setPlanFilter("All");
    setStatusFilter("Any status");
    setSignupFilter("All time");
    setLastActiveFilter("Any activity");
    setPlatformFilter("All platforms");
    setPage(1);
  }

  function handleExportCsv() {
    const csv = toCsv(filteredCustomers);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dhan-customers.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-5">
        <div ref={filterRowRef} className="flex flex-wrap items-stretch gap-3">
          <div className="flex flex-none items-center gap-1 rounded-md border border-border bg-surface p-1">
            {(["All", "Free", "Plus"] as PlanFilter[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setPlanFilter(option);
                  setPage(1);
                }}
                className={`rounded-sm px-4 py-2.5 text-sm transition-colors ${
                  planFilter === option
                    ? "bg-primary font-medium text-primary-foreground"
                    : "text-muted-foreground hover:bg-background"
                }`}
              >
                {option === "All" ? "All plans" : option}
              </button>
            ))}
          </div>

          <FilterDropdown
            value={statusFilter}
            options={STATUS_OPTIONS.map((value) => ({ value }))}
            onChange={(value) => {
              // TEMP DEBUG: remove once filter selection is confirmed in devtools.
              console.log("[CustomersFilters] status filter ->", value);
              setStatusFilter(value as StatusFilter);
              setPage(1);
              setOpenDropdown(null);
            }}
            isOpen={openDropdown === "status"}
            onToggle={() => toggleDropdown("status")}
          />

          <FilterDropdown
            value={signupFilter}
            options={SIGNUP_OPTIONS.map((value) => ({ value }))}
            onChange={(value) => {
              console.log("[CustomersFilters] signed-up filter ->", value);
              setSignupFilter(value as SignupFilter);
              setPage(1);
              setOpenDropdown(null);
            }}
            isOpen={openDropdown === "signup"}
            onToggle={() => toggleDropdown("signup")}
          />

          <FilterDropdown
            value={lastActiveFilter}
            options={LAST_ACTIVE_OPTIONS.map((value) => ({ value }))}
            onChange={(value) => {
              console.log("[CustomersFilters] last-active filter ->", value);
              setLastActiveFilter(value as LastActiveFilter);
              setPage(1);
              setOpenDropdown(null);
            }}
            isOpen={openDropdown === "lastActive"}
            onToggle={() => toggleDropdown("lastActive")}
          />

          <FilterDropdown
            value={platformFilter}
            options={PLATFORM_OPTIONS.map((value) => ({ value }))}
            onChange={(value) => {
              console.log("[CustomersFilters] platform filter ->", value);
              setPlatformFilter(value as PlatformFilter);
              setPage(1);
              setOpenDropdown(null);
            }}
            isOpen={openDropdown === "platform"}
            onToggle={() => toggleDropdown("platform")}
            align="right"
          />

          <FilterDropdown
            value={sortFilter}
            options={SORT_OPTIONS}
            onChange={(value) => {
              console.log("[CustomersFilters] sort ->", value);
              setSortFilter(value);
              setOpenDropdown(null);
            }}
            isOpen={openDropdown === "sort"}
            onToggle={() => toggleDropdown("sort")}
            align="right"
          />
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.onRemove}
                className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
              >
                {chip.label}
                <X size={12} weight="bold" />
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-4">
          <span className="text-sm text-muted-foreground">
            Showing {pageRows.length} of {filteredCustomers.length} customers
          </span>
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-primary hover:bg-background"
          >
            <DownloadSimple size={15} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="grid grid-cols-[40px_minmax(0,2.2fr)_minmax(0,1.3fr)_1fr_100px_130px_1fr_100px] items-center gap-3 border-b border-border bg-background px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Checkbox checked={pageAllSelected} onChange={togglePageAll} ariaLabel="Select all customers on this page" />
          <span>Customer</span>
          <span>Phone</span>
          <span>Signed Up</span>
          <span>Plan</span>
          <span>Status</span>
          <span>Last Active</span>
          <span>Platform</span>
        </div>

        {pageRows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <MagnifyingGlass size={28} className="text-muted" />
            <span className="text-sm font-medium text-primary">No customers match these filters</span>
            <span className="max-w-sm text-sm text-muted-foreground">
              Try widening the date range or clearing a filter to see more results.
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-primary hover:bg-background"
            >
              Clear filters
            </button>
          </div>
        ) : (
          pageRows.map((customer) => (
            <div
              key={customer.id}
              className="grid grid-cols-[40px_minmax(0,2.2fr)_minmax(0,1.3fr)_1fr_100px_130px_1fr_100px] items-center gap-3 border-b border-border px-5 py-4 text-sm last:border-b-0 hover:bg-background"
            >
              <Checkbox
                checked={selectedIds.includes(customer.id)}
                onChange={() => toggleRow(customer.id)}
                ariaLabel={`Select ${customer.name}`}
              />
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-surface text-xs font-semibold text-primary">
                  {initials(customer.name)}
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium text-primary">{customer.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{customer.email}</span>
                </div>
              </div>
              <span className="text-muted-foreground tabular-nums">{customer.phone}</span>
              <span className="text-muted-foreground tabular-nums">{customer.signupLabel}</span>
              <div>
                <PlanPill plan={customer.plan} />
              </div>
              <div>
                <StatusDot status={customer.status} />
              </div>
              <span className="text-muted-foreground">{customer.lastActiveLabel}</span>
              <PlatformCell platform={customer.platform} />
            </div>
          ))
        )}

        <div className="flex items-center justify-between border-t border-border px-5 py-4 text-sm text-muted-foreground">
          <span>
            Showing {pageRows.length} of {filteredCustomers.length}
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-sm border border-border px-3 py-2 text-primary hover:bg-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-sm border border-border px-3 py-2 text-primary hover:bg-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
