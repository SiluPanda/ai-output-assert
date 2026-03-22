export function extractJSONFromCodeFence(text: string): string | null {
  const match = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/i);
  return match ? match[1].trim() : null;
}
