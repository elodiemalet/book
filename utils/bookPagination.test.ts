import {describe, expect, it} from 'vitest';
import {fillPage, paginatePosts, visualLineCount} from './bookPagination';
import PostEntity from '../entities/PostEntity';

describe('visualLineCount', () => {
    it('counts a short line as a single visual line', () => {
        expect(visualLineCount('hello', 20)).toBe(1);
    });

    it('counts a line exactly at the limit as a single visual line', () => {
        expect(visualLineCount('a'.repeat(20), 20)).toBe(1);
    });

    it('wraps a line over the limit across multiple visual lines', () => {
        expect(visualLineCount('a'.repeat(45), 20)).toBe(3);
    });

    it('treats an empty line as one visual line', () => {
        expect(visualLineCount('', 20)).toBe(1);
    });
});

describe('fillPage', () => {
    it('returns 0 for an empty list', () => {
        expect(fillPage([], 5, 20)).toBe(0);
    });

    it('consumes every line that fits within budget', () => {
        expect(fillPage(['a', 'b', 'c'], 5, 20)).toBe(3);
    });

    it('stops once the visual line budget is spent', () => {
        expect(fillPage(['a', 'b', 'c', 'd', 'e', 'f'], 5, 20)).toBe(5);
    });

    it('always consumes at least one line even if it alone exceeds the budget', () => {
        expect(fillPage(['a'.repeat(100)], 3, 20)).toBe(1);
    });
});

describe('paginatePosts', () => {
    const limits = {maxLines: 8, maxLinesFirstPage: 8, maxCharsPerLine: 20};

    it('keeps a short poem on a single page, unchanged', () => {
        const post = PostEntity.create('Titre', 'Auteur', 'ligne1\nligne2');
        const pages = paginatePosts([post], limits);
        expect(pages).toHaveLength(1);
        expect(pages[0]).toBe(post);
    });

    it('does not reserve room for the author/date signature when it is hidden', () => {
        const post = PostEntity.create('Titre', 'Auteur', Array.from({length: 6}, (_, i) => `ligne ${i}`).join('\n'));

        expect(paginatePosts([post], limits)).toHaveLength(2);
        expect(paginatePosts([post], {...limits, showSignature: false})).toHaveLength(1);
    });

    it('splits a long poem across multiple pages without losing or duplicating lines', () => {
        const lines = Array.from({length: 12}, (_, i) => `ligne ${i}`);
        const post = PostEntity.create('Titre', 'Auteur', lines.join('\n'));
        const pages = paginatePosts([post], limits);

        expect(pages.length).toBeGreaterThan(1);
        expect(pages.every(p => p.content.length > 0)).toBe(true);
        expect(pages.map(p => p.content).join('\n')).toBe(lines.join('\n'));
    });

    it('preserves post identity (id/title/author) across continuation pages', () => {
        const lines = Array.from({length: 12}, (_, i) => `ligne ${i}`);
        const post = new PostEntity(42, 'Titre', 'Auteur', lines.join('\n'), 0, new Date());
        const pages = paginatePosts([post], limits);
        expect(pages.every(p => p.id === 42 && p.postTitle === 'Titre' && p.author === 'Auteur')).toBe(true);
    });

    it('paginates multiple posts in order', () => {
        const short1 = PostEntity.create('A', 'X', 'l1');
        const short2 = PostEntity.create('B', 'Y', 'l1');
        const pages = paginatePosts([short1, short2], limits);
        expect(pages.map(p => p.postTitle)).toEqual(['A', 'B']);
    });

    it('terminates and preserves content for pathological input (many short lines)', () => {
        const lines = Array.from({length: 200}, (_, i) => `${i}`);
        const post = PostEntity.create('Titre', 'Auteur', lines.join('\n'));
        const pages = paginatePosts([post], limits);
        expect(pages.map(p => p.content).join('\n')).toBe(lines.join('\n'));
    });
});
