const ABBREV_PATTERN = /\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|Inc|Ltd|Corp|vs|etc|e\.g|i\.e|U\.S|U\.K|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.$/i;

export function splitSentences(text: string): string[] {
  if (!text || text.trim().length === 0) return [];

  const result: string[] = [];
  // Split on sentence-ending punctuation followed by whitespace + uppercase letter
  // We use a manual approach to skip abbreviations
  const raw = text.split(/(?<=[.!?]['")]*)\s+(?=[A-Z"])/);

  for (const part of raw) {
    const trimmed = part.trim();
    if (trimmed.length === 0) continue;

    // Check if the last "sentence" ends with a known abbreviation — if so, it got
    // split incorrectly and we should merge it back with the next part.
    // Because we already split, we instead check each segment itself.
    // If a segment ends with an abbreviation dot (e.g. "Dr."), it should have been
    // attached to the next segment. We handle this by checking if the TRIMMED segment
    // (without trailing whitespace) ends with an abbreviation.
    if (result.length > 0) {
      const prev = result[result.length - 1];
      // If prev ends with a known abbreviation, merge
      if (ABBREV_PATTERN.test(prev)) {
        result[result.length - 1] = prev + ' ' + trimmed;
        continue;
      }
    }
    result.push(trimmed);
  }

  // Final pass: if the last element ends with an abbreviation (no merge needed),
  // it's still a valid sentence — leave it as is.
  return result;
}
