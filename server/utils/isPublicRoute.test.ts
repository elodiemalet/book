import {describe, expect, it} from 'vitest';
import {isPublicRoute} from './isPublicRoute';

describe('isPublicRoute', () => {
    it('lets non-api routes through', () => {
        expect(isPublicRoute('GET', '/book')).toBe(true);
    });

    it('lets /api/v1/* through (protected by its own token middleware)', () => {
        expect(isPublicRoute('POST', '/api/v1/post')).toBe(true);
    });

    it.each([
        ['GET', '/api/book-config'],
        ['GET', '/api/image'],
        ['GET', '/api/post'],
        ['POST', '/api/login'],
        ['POST', '/api/prospect'],
    ])('treats %s %s as public', (method, path) => {
        expect(isPublicRoute(method, path)).toBe(true);
    });

    it('ignores the query string when matching', () => {
        expect(isPublicRoute('GET', '/api/post?limit=10&page=2')).toBe(true);
    });

    it.each([
        ['GET', '/api/post/1'],
        ['POST', '/api/post'],
        ['PUT', '/api/book-config'],
        ['GET', '/api/stats'],
        ['POST', '/api/generate-pdf'],
        ['GET', '/api/config/api-token'],
        ['POST', '/api/import'],
        ['GET', '/api/import/queue'],
    ])('requires a session for %s %s', (method, path) => {
        expect(isPublicRoute(method, path)).toBe(false);
    });

    it('is method-sensitive: GET being public does not make PUT public', () => {
        expect(isPublicRoute('GET', '/api/book-config')).toBe(true);
        expect(isPublicRoute('PUT', '/api/book-config')).toBe(false);
    });
});
