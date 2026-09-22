"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col bg-primary">
      <div className="px-6 py-6">
        <span className="text-lg font-semibold tracking-wide text-primary-foreground">
          Dhan Admin
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
    </aside>
  );
}
