export function truncate(s: string, max: number) {
  if (s.length <= max) return s;
  return `${s.slice(0, Math.max(0, max - 1))}…`;
}

export function bodyPreview(body: string, maxChars = 120) {
  const cleaned = body.replace(/\s+/g, " ").trim();
  return truncate(cleaned, maxChars);
}

