import type { MatcherResult } from '../types';
export declare function toNotBeTruncated(received: string): MatcherResult;
export declare function toNotBeHedged(received: string, phrases?: string[], threshold?: number): MatcherResult;
export declare function toBeCompleteJSON(received: string): MatcherResult;
export declare function toNotRepeat(received: string, options?: {
    windowSize?: number;
    threshold?: number;
}): MatcherResult;
//# sourceMappingURL=quality.d.ts.map