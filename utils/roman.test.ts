import {describe, expect, it} from 'vitest';
import {toRoman} from './roman';

describe('toRoman', () => {
    it.each([[1, 'I'], [4, 'IV'], [9, 'IX'], [14, 'XIV'], [40, 'XL'], [2026, 'MMXXVI']])('writes %i as %s', (value, expected) => {
        expect(toRoman(value)).toBe(expected);
    });
});
