"use client";

import Link from "next/link";
import { LockSimple } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[236px] shrink-0 flex-col overflow-y-auto bg-primary">
      <div className="flex flex-col items-start gap-2 px-6 py-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/dhan-logomark.svg" alt="Dhan" className="h-[26px] w-auto" />
        </div>
        <span className="text-xs uppercase tracking-[0.06em] text-primary-foreground/50">
          Admin console
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-4">
        {navItems.map((item) => {
          const ItemIcon = item.icon;

          if (item.disabled) {
            return (
              <div
                key={item.label}
                className="flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-primary-foreground/40"
              >
                <span className="flex items-center gap-3">
                  <ItemIcon size={18} />
                  {item.label}
                </span>
                <span className="rounded-full bg-primary-foreground/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary-foreground/60">
                  Soon
                </span>
              </div>
            );
          }

          const active = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-secondary text-secondary-foreground font-medium"
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              }`}
            >
              <ItemIcon size={18} weight={active ? "fill" : "regular"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 mb-5 mt-auto flex flex-col gap-2 rounded-md bg-primary-foreground/5 px-3 py-3.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-secondary">
          <LockSimple size={13} />
          Local-first
        </div>
        <p className="text-sm leading-relaxed text-primary-foreground/60">
          Account metadata only. Transactions and budgets stay on the user&apos;s device.
        </p>
      </div>
    </aside>
  );
}
