import {describe, expect, it} from 'vitest';
import {canAccessBook} from './bookAccess';

const base = {
    loggedIn: false,
    isHydratingServerRender: false,
    tokenFromQuery: '',
    expectedToken: 'secret-token' as string | undefined,
};

describe('canAccessBook', () => {
    it('allows a logged-in user without token', () => {
        expect(canAccessBook({...base, loggedIn: true})).toBe(true);
    });

    it('allows the server render when the query token matches', () => {
        expect(canAccessBook({...base, tokenFromQuery: 'secret-token'})).toBe(true);
    });

    it('denies the server render when the query token is wrong', () => {
        expect(canAccessBook({...base, tokenFromQuery: 'nope'})).toBe(false);
    });

    // Regression: the PDF generator (puppeteer) loads /book?token=… without a session.
    // The server validates the token, then the client hydrates. The token is a private
    // runtime config key, so the client reads it as undefined and must not re-check it.
    it('allows client hydration of a page the server already rendered', () => {
        expect(canAccessBook({
            ...base,
            isHydratingServerRender: true,
            tokenFromQuery: 'secret-token',
            expectedToken: undefined,
        })).toBe(true);
    });

    it('denies client-side navigation without session (token is unreadable on the client)', () => {
        expect(canAccessBook({...base, tokenFromQuery: 'secret-token', expectedToken: undefined})).toBe(false);
    });

    it('denies an empty token when the server token is not configured', () => {
        expect(canAccessBook({...base, tokenFromQuery: '', expectedToken: ''})).toBe(false);
    });
});
