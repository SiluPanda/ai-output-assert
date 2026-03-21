export function extractNgrams(tokens: string[], n: number): string[] {
  if (n <= 0 || tokens.length < n) return [];
  const result: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    result.push(tokens.slice(i, i + n).join(' '));
  }
  return result;
}
