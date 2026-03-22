"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SYSTEM_PROMPT_PATTERNS = exports.DEFAULT_REFUSAL_PHRASES = exports.DEFAULT_HEDGING_PHRASES = void 0;
exports.DEFAULT_HEDGING_PHRASES = [
    'I think',
    'I believe',
    'I assume',
    'I suppose',
    'I guess',
    'it seems',
    'it appears',
    'it looks like',
    'it might be',
    'possibly',
    'probably',
    'perhaps',
    'maybe',
    'likely',
    'not sure',
    "I'm not certain",
    "I'm not sure",
    'could be',
    'might be',
    'may be',
    'as far as I know',
    'to the best of my knowledge',
];
exports.DEFAULT_REFUSAL_PHRASES = [
    "I can't",
    'I cannot',
    "I'm unable to",
    'I am unable to',
    "I won't",
    'I will not',
    "I'm not able to",
    "I'm sorry, but",
    'I apologize, but',
    "I don't feel comfortable",
    'That is not something I can',
    'As an AI',
    'As a language model',
];
exports.DEFAULT_SYSTEM_PROMPT_PATTERNS = [
    /you are a|your name is|your role is|your job is/i,
    /system prompt|system message|system instruction/i,
    /ignore (all )?(previous|prior) instruction/i,
    /you must|you should always|never (say|tell|reveal)/i,
];
//# sourceMappingURL=hedging-phrases.js.map