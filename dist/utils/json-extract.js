"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractJSONFromCodeFence = extractJSONFromCodeFence;
function extractJSONFromCodeFence(text) {
    const match = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/i);
    return match ? match[1].trim() : null;
}
//# sourceMappingURL=json-extract.js.map