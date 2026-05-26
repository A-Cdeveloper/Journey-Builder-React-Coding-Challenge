type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
  ariaLabel = "Search",
}: SearchInputProps) {
  return (
    <input
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={ariaLabel}
      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700"
    />
  );
}
