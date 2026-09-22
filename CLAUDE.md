@AGENTS.md

# Dhan Admin Console

## Design system
Reference: `app/globals.css` (theme tokens) — never hardcode hex values, always use the Tailwind theme classes below.

- Primary navy `#141C41` (`bg-primary`/`text-primary`) on white (`primary-foreground`)
- Secondary gold `#C9A84C` (`bg-secondary`/`text-secondary`) on navy (`secondary-foreground`) — used for accent CTAs and highlighted/active states
- Page background `#F4F5F9` (`bg-background`), cards/inputs/topbar `#FFFFFF` (`bg-surface`), borders `#E3E5EE` (`border-border`)
- Text: `text-muted` (`#8B8FA3`, icons/secondary), `text-muted-foreground` (`#5B5F77`, body secondary)
- Status colors + tint surfaces: `success`/`success-surface`, `danger`/`danger-surface`, `warning`, `secondary-surface` (gold tint), `primary-surface` (navy tint) — pair a status color with its `-surface` tint for pills/badges
- Font: Poppins (`font-sans`), fallback Segoe UI
- Radii: 4 / 8 / 12 / pill only (`rounded-sm/md/lg/full`) — nothing in between
- Spacing: 8px grid — use even Tailwind steps (`p-2`, `p-4`, `gap-6`...), avoid odd ones (`p-1`, `p-3`)
- **No `box-shadow`, ever.** Depth comes only from borders and background-color changes (flat design).

## Critical rule for building any new page
Before writing any page, ALWAYS read the corresponding section of `design-export/index.html` (or ask for a screenshot of the specific Claude Design screen if the page isn't in that export) and match its ACTUAL layout, structure, and copy exactly — don't infer or approximate the layout from a text description alone. If a page described in a prompt seems to differ from what's in `design-export/` or a provided screenshot, flag the mismatch before building rather than guessing.

## Pages built so far
- **Overview** (`app/page.tsx`): server component — metric cards, plan-mix breakdown, and a recent-activity feed, driven by `lib/overview-data.ts`.
- **Customers** (`app/customers/page.tsx`): filterable/sortable table (plan, status, signup, last-active, platform filters), checkbox multi-select, CSV export, pagination.
- **Risk & Security** (`app/risk-security/page.tsx`): two stacked sections — suspicious login alerts table with review-status tabs, and a data deletion requests table with a confirm modal.
- **Offers** (`app/offers/page.tsx`): tabbed, compose-first layout — NOT a table-first/modal-based page. Left column is the audience-pill + headline/message form, right column is a live-updating iOS-style preview, History table sits full-width below both.

## Known gotchas
- Phosphor icons: server components must import from `@phosphor-icons/react/ssr` (and the `Icon` type from `@phosphor-icons/react/lib`), not the default `@phosphor-icons/react` import — the default import needs client-side context and errors in Server Components. Client components (`"use client"`) can use the default import as normal.
- Git requires `user.name`/`user.email` configured (already done).
