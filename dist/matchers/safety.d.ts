import type { MatcherResult, PIIPattern, ToxicWord } from '../types';
export declare function toNotContainPII(received: string, patterns?: PIIPattern[]): MatcherResult;
export declare function toNotContainToxicContent(received: string, words?: ToxicWord[]): MatcherResult;
export declare function toNotLeakSystemPrompt(received: string, patterns?: RegExp[]): MatcherResult;
export declare function toNotBeRefusal(received: string, phrases?: string[]): MatcherResult;
//# sourceMappingURL=safety.d.ts.map