import type { MatcherResult, EmbedFn } from '../types';
export declare function toBeSemanticallySimilarTo(received: string, expected: string, options?: {
    threshold?: number;
    embedFn?: EmbedFn;
}): Promise<MatcherResult>;
export declare function toAnswerQuestion(received: string, question: string, options?: {
    embedFn?: EmbedFn;
}): Promise<MatcherResult>;
export declare function toBeFactuallyConsistentWith(received: string, reference: string, options?: {
    embedFn?: EmbedFn;
}): Promise<MatcherResult>;
//# sourceMappingURL=semantic.d.ts.map