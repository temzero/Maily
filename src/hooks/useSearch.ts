import { createMemo } from "solid-js";
import type { Email } from "~/types/email";

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function useSearch(emails: () => Email[], query: () => string) {
  return createMemo(() => {
    const q = normalize(query());
    if (!q) return emails();

    return emails().filter((e) => {
      const haystack = `${e.subject}\n${e.body}\n${e.from.name}\n${e.from.email}`.toLowerCase();
      return haystack.includes(q);
    });
  });
}

