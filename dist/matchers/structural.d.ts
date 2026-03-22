import type { MatcherResult } from '../types';
export declare function toBeValidJSON(received: string): MatcherResult;
export declare function toMatchSchema(received: string, schema: object): MatcherResult;
export declare function toHaveJSONFields(received: string, fields: string[]): MatcherResult;
export declare function toBeValidMarkdown(received: string): MatcherResult;
export declare function toContainCodeBlock(received: string, language?: string): MatcherResult;
//# sourceMappingURL=structural.d.ts.map