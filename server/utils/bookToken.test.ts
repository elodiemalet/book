import {describe, expect, it} from 'vitest';
import {acceptsBookToken, hasValidBookToken} from './bookToken';

describe('hasValidBookToken', () => {
    it('accepts the expected token', () => {
        expect(hasValidBookToken('secret', 'secret')).toBe(true);
    });

    it('rejects a wrong or missing token', () => {
        expect(hasValidBookToken('nope', 'secret')).toBe(false);
        expect(hasValidBookToken(undefined, 'secret')).toBe(false);
        expect(hasValidBookToken('', 'secret')).toBe(false);
    });

    it('rejects everything when no token is configured', () => {
        expect(hasValidBookToken('', '')).toBe(false);
        expect(hasValidBookToken(undefined, undefined)).toBe(false);
    });
});

describe('acceptsBookToken', () => {
    it('opens reading the texts of the book, with or without query', () => {
        expect(acceptsBookToken('GET', '/api/post')).toBe(true);
        expect(acceptsBookToken('GET', '/api/post?limit=all')).toBe(true);
    });

    it('opens nothing else', () => {
        expect(acceptsBookToken('POST', '/api/post')).toBe(false);
        expect(acceptsBookToken('GET', '/api/post/1')).toBe(false);
        expect(acceptsBookToken('PUT', '/api/post/order')).toBe(false);
        expect(acceptsBookToken('GET', '/api/stats')).toBe(false);
    });
});
