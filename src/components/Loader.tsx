type LoaderProps = {
  label?: string;
};

export function Loader({ label = "Loading…" }: LoaderProps) {
  return (
    <div
      className="flex items-center gap-2 text-sm text-slate-500"
      role="status"
      aria-live="polite"
    >
      <span
        className="size-4 shrink-0 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"
        aria-hidden
      />
      <p>{label}</p>
    </div>
  );
}
