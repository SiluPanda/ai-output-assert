"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toContainAllOf = toContainAllOf;
exports.toContainAnyOf = toContainAnyOf;
exports.toNotContain = toNotContain;
exports.toMentionEntity = toMentionEntity;
function toContainAllOf(received, phrases) {
    const lower = received.toLowerCase();
    const missing = phrases.filter((p) => !lower.includes(p.toLowerCase()));
    const pass = missing.length === 0;
    return {
        pass,
        message: () => pass
            ? `Expected output not to contain all of: ${phrases.join(', ')}`
            : `Expected output to contain all of: ${phrases.join(', ')}, but missing: ${missing.join(', ')}`,
        details: { phrases, missing },
    };
}
function toContainAnyOf(received, phrases) {
    const lower = received.toLowerCase();
    const found = phrases.filter((p) => lower.includes(p.toLowerCase()));
    const pass = found.length > 0;
    return {
        pass,
        message: () => pass
            ? `Expected output not to contain any of: ${phrases.join(', ')}`
            : `Expected output to contain at least one of: ${phrases.join(', ')}, but none were found`,
        details: { phrases, found },
    };
}
function toNotContain(received, phrase) {
    const pass = !received.toLowerCase().includes(phrase.toLowerCase());
    return {
        pass,
        message: () => pass
            ? `Expected output to contain "${phrase}", but it did not`
            : `Expected output not to contain "${phrase}", but it was found`,
        details: { phrase, found: !pass },
    };
}
function toMentionEntity(received, entity, aliases) {
    const lower = received.toLowerCase();
    const terms = [entity, ...(aliases ?? [])];
    const found = terms.find((t) => lower.includes(t.toLowerCase()));
    const pass = found !== undefined;
    return {
        pass,
        message: () => pass
            ? `Expected output not to mention "${entity}" (or aliases)`
            : `Expected output to mention "${entity}"${aliases?.length ? ` or aliases [${aliases.join(', ')}]` : ''}, but none were found`,
        details: { entity, aliases, foundTerm: found ?? null },
    };
}
//# sourceMappingURL=content.js.map