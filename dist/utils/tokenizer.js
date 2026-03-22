"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = tokenize;
function tokenize(text) {
    return text.split(/\s+/).filter(Boolean);
}
//# sourceMappingURL=tokenizer.js.map