export interface MatcherResult {
    pass: boolean;
    message: () => string;
    details: Record<string, unknown>;
}
export type EmbedFn = (text: string) => Promise<number[]>;
export type Tone = 'formal' | 'casual' | 'technical' | 'friendly';
export type ToneScores = Record<Tone, number>;
export type Sentiment = 'positive' | 'negative' | 'neutral';
export type OutputFormat = 'json' | 'markdown' | 'list' | 'csv' | 'xml' | 'yaml' | 'table';
export interface PIIPattern {
    type: string;
    pattern: RegExp;
    validate?: (match: string) => boolean;
    label: string;
}
export interface ToxicWord {
    word: string;
    severity: 'critical' | 'warning' | 'info';
}
export type PIIMatch = {
    type: string;
    value: string;
    position: [number, number];
};
export interface AIAssertionOptions {
    embedFn?: EmbedFn;
    semanticThreshold?: number;
    answerThreshold?: number;
    consistencyThreshold?: number;
    conciseMaxTokens?: number;
    verboseMaxSentences?: number;
    hedgingMaxRatio?: number;
    repeatMaxRepetitions?: number;
    systemPromptLeakThreshold?: number;
    sentimentNeutralRange?: [number, number];
    customPIIPatterns?: PIIPattern[];
    customToxicWords?: ToxicWord[];
    customEntityAliases?: Record<string, string[]>;
    customHedgingPhrases?: string[];
    customRefusalPhrases?: string[];
}
//# sourceMappingURL=types.d.ts.map