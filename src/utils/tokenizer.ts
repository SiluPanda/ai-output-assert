export function tokenize(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}
