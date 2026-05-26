import type { PrefillSourceGroup } from "@/features/prefill/prefillDataSources/index.ts";

export function filterSourceGroups(
  groups: PrefillSourceGroup[],
  searchQuery: string,
): PrefillSourceGroup[] {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return groups;

  return groups
    .map((group) => {
      const groupMatches = group.label.toLowerCase().includes(query);
      const matchingOptions = group.options.filter((option) =>
        option.label.toLowerCase().includes(query),
      );

      if (groupMatches) return group;
      if (matchingOptions.length === 0) return null;

      return { ...group, options: matchingOptions };
    })
    .filter((group): group is PrefillSourceGroup => group !== null);
}
