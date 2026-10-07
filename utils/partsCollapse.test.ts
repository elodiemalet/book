import {describe, expect, it} from 'vitest';
import {COLLAPSE_THRESHOLD, isCollapsed} from './partsCollapse';

describe('isCollapsed', () => {
    it('keeps a small part open by default', () => {
        expect(isCollapsed('10', COLLAPSE_THRESHOLD, {})).toBe(false);
    });

    it('folds a part with more texts than the threshold by default', () => {
        expect(isCollapsed('10', COLLAPSE_THRESHOLD + 1, {})).toBe(true);
    });

    it('follows the saved choice over the default', () => {
        expect(isCollapsed('10', COLLAPSE_THRESHOLD + 1, {'10': false})).toBe(false);
        expect(isCollapsed('10', 1, {'10': true})).toBe(true);
    });
});
