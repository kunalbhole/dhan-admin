export function PlaceholderNotice({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-primary">{title}</h2>
      <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-muted">
        Page not built yet.
      </div>
    </div>
  );
}
