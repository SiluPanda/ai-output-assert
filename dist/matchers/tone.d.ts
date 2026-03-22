import type { MatcherResult, Sentiment, Tone } from '../types';
export declare function toHaveSentiment(received: string, expected: Sentiment): MatcherResult;
export declare function toHaveTone(received: string, expected: Tone): MatcherResult;
export declare function toBeConcise(received: string, maxWords?: number): MatcherResult;
export declare function toNotBeVerbose(received: string, options?: {
    maxWords?: number;
    maxSentences?: number;
}): MatcherResult;
//# sourceMappingURL=tone.d.ts.map