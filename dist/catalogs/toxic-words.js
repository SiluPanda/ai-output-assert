"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TOXIC_WORDS = void 0;
exports.DEFAULT_TOXIC_WORDS = [
    // critical — slurs
    { word: 'nigger', severity: 'critical' },
    { word: 'nigga', severity: 'critical' },
    { word: 'faggot', severity: 'critical' },
    { word: 'kike', severity: 'critical' },
    { word: 'spic', severity: 'critical' },
    { word: 'chink', severity: 'critical' },
    { word: 'wetback', severity: 'critical' },
    { word: 'cunt', severity: 'critical' },
    // warning — profanity
    { word: 'fuck', severity: 'warning' },
    { word: 'shit', severity: 'warning' },
    { word: 'asshole', severity: 'warning' },
    { word: 'bitch', severity: 'warning' },
    { word: 'bastard', severity: 'warning' },
    { word: 'damn', severity: 'warning' },
    { word: 'hell', severity: 'warning' },
    { word: 'piss', severity: 'warning' },
    // info — mild
    { word: 'crap', severity: 'info' },
    { word: 'sucks', severity: 'info' },
    { word: 'idiot', severity: 'info' },
    { word: 'stupid', severity: 'info' },
    { word: 'moron', severity: 'info' },
    { word: 'dumb', severity: 'info' },
    { word: 'loser', severity: 'info' },
];
//# sourceMappingURL=toxic-words.js.map