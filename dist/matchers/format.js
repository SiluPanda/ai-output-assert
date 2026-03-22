"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toStartWith = toStartWith;
exports.toEndWith = toEndWith;
exports.toBeFormattedAs = toBeFormattedAs;
exports.toHaveListItems = toHaveListItems;
function toStartWith(received, prefix) {
    const pass = received.startsWith(prefix);
    return {
        pass,
        message: () => pass
            ? `Expected string not to start with "${prefix}"`
            : `Expected string to start with "${prefix}", but got "${received.slice(0, 50)}"`,
        details: { prefix, receivedStart: received.slice(0, prefix.length) },
    };
}
function toEndWith(received, suffix) {
    const pass = received.endsWith(suffix);
    return {
        pass,
        message: () => pass
            ? `Expected string not to end with "${suffix}"`
            : `Expected string to end with "${suffix}", but got "...${received.slice(-50)}"`,
        details: { suffix, receivedEnd: received.slice(-suffix.length) },
    };
}
function toBeFormattedAs(received, format) {
    let pass = false;
    let reason = '';
    switch (format) {
        case 'json': {
            const text = received.trim();
            try {
                JSON.parse(text);
                pass = true;
            }
            catch (e) {
                reason = e.message;
            }
            break;
        }
        case 'markdown': {
            const hasHeading = /^#{1,6}\s/m.test(received);
            const hasBold = /\*\*[^*]+\*\*/.test(received);
            const hasItalic = /\*[^*]+\*/.test(received);
            const hasCodeFence = /```/.test(received);
            const hasList = /^[-*]\s|^\d+\.\s/m.test(received);
            const hasBlockquote = /^>\s/m.test(received);
            pass = hasHeading || hasBold || hasItalic || hasCodeFence || hasList || hasBlockquote;
            if (!pass)
                reason = 'No markdown patterns detected (headings, bold, code, lists, blockquotes)';
            break;
        }
        case 'list': {
            const lines = received.split('\n').filter((l) => l.trim().length > 0);
            const listLines = lines.filter((l) => /^\s*[-*]\s|^\s*\d+[.)]\s/.test(l));
            pass = lines.length > 0 && listLines.length / lines.length >= 0.5;
            if (!pass)
                reason = `Only ${listLines.length}/${lines.length} lines are list items`;
            break;
        }
        case 'csv': {
            const lines = received.trim().split('\n').filter((l) => l.trim().length > 0);
            if (lines.length >= 2) {
                const colCounts = lines.map((l) => l.split(',').length);
                const first = colCounts[0];
                pass = first >= 2 && colCounts.every((c) => c === first);
            }
            if (!pass)
                reason = 'CSV requires consistent comma-separated columns across all lines';
            break;
        }
        case 'xml': {
            pass = /<[a-zA-Z][^>]*>[\s\S]*<\/[a-zA-Z][^>]*>/.test(received);
            if (!pass)
                reason = 'No XML tag pairs detected';
            break;
        }
        case 'yaml': {
            const lines = received.trim().split('\n').filter((l) => l.trim().length > 0 && !l.trim().startsWith('#'));
            const keyValueLines = lines.filter((l) => /^\s*[\w-]+\s*:/.test(l));
            pass = lines.length > 0 && keyValueLines.length / lines.length >= 0.5;
            if (!pass)
                reason = 'Fewer than 50% of lines match YAML key: value pattern';
            break;
        }
        case 'table': {
            pass = /\|[^|]+\|/.test(received) && received.includes('|');
            if (!pass)
                reason = 'No table pipe (|) patterns detected';
            break;
        }
    }
    return {
        pass,
        message: () => pass
            ? `Expected output not to be formatted as ${format}`
            : `Expected output to be formatted as ${format}${reason ? ': ' + reason : ''}`,
        details: { format, reason },
    };
}
function toHaveListItems(received, items) {
    const missing = [];
    for (const item of items) {
        // Item must appear on a line that starts with a bullet or number
        const escaped = item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`^\\s*(?:[-*]|\\d+[.)])\\s+.*${escaped}`, 'm');
        if (!pattern.test(received)) {
            missing.push(item);
        }
    }
    const pass = missing.length === 0;
    return {
        pass,
        message: () => pass
            ? `Expected output not to have all list items: ${items.join(', ')}`
            : `Expected output to have list items, but missing: ${missing.join(', ')}`,
        details: { items, missing },
    };
}
//# sourceMappingURL=format.js.map