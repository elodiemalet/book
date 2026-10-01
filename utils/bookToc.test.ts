import {describe, expect, it} from 'vitest';
import {
    LANDING_TOC_DEFAULT_MAX_PARTS,
    groupByPart,
    landingTocLimit,
    layoutBook,
    paginateToc,
    tocLinesFromBody,
    tocParts,
    tocTitle,
    type BookLayoutOptions,
    type TocLine,
} from './bookToc';
import PostEntity from '../entities/PostEntity';

const post = (id: number, title: string, lineCount: number, partId: number | null = null) =>
    new PostEntity(id, title, 'Auteur', Array.from({length: lineCount}, (_, i) => `ligne ${i}`).join('\n'), 0, new Date(0), undefined, partId);

const limits = {maxLines: 10, maxLinesFirstPage: 8, maxCharsPerLine: 40, showSignature: false};

const options = (overrides: Partial<BookLayoutOptions> = {}): BookLayoutOptions => ({
    limits,
    pageStart: 6,
    showToc: true,
    tocPosition: 'start',
    ...overrides,
});

const text = (title: string, page: number): TocLine => ({type: 'text', postId: page, title, page});
const part = (title: string, page: number): TocLine => ({type: 'part', partId: page, title, numeral: 'I', page});

describe('tocTitle', () => {
    it('keeps only the title before the subtitle separator', () => {
        expect(tocTitle('Le phare_à la mer')).toBe('Le phare');
    });

    it('returns the title unchanged when there is no subtitle', () => {
        expect(tocTitle('Le phare')).toBe('Le phare');
    });
});

describe('groupByPart', () => {
    const parts = [{id: 10, title: 'Matin'}, {id: 20, title: 'Vide'}, {id: 30, title: 'Soir'}];

    it('puts texts without a part first, then each part in order', () => {
        const sections = groupByPart([post(1, 'A', 1, 30), post(2, 'B', 1), post(3, 'C', 1, 10)], parts);
        expect(sections.map(s => [s.part?.title ?? null, s.posts.map(p => p.id)])).toEqual([
            [null, [2]],
            ['Matin', [3]],
            ['Soir', [1]],
        ]);
    });

    it('skips empty parts and numbers only the parts that are in the book', () => {
        const sections = groupByPart([post(1, 'A', 1, 10), post(2, 'B', 1, 30)], parts);
        expect(sections.map(s => s.numeral)).toEqual(['I', 'II']);
    });

    it('treats a text attached to an unknown part as a text without part', () => {
        const sections = groupByPart([post(1, 'A', 1, 99)], parts);
        expect(sections[0]?.part).toBeNull();
    });

    it('orders the texts of a part by position, keeping the given order for equal positions', () => {
        const withPosition = (id: number, position: number) => Object.assign(post(id, `T${id}`, 1, 10), {position});
        const sections = groupByPart([withPosition(1, 2), withPosition(2, 0), withPosition(3, 1), withPosition(4, 1)], parts);
        expect(sections[0]?.posts.map(p => p.id)).toEqual([2, 3, 4, 1]);
    });
});

describe('tocLinesFromBody', () => {
    it('lists each text once, with its first page, when the book has no part', () => {
        const body = layoutBook([post(1, 'Un', 1), post(2, 'Deux', 20)], [], options({showToc: false})).bodyPages;
        expect(tocLinesFromBody(body).map(line => [line.type, line.title, line.page])).toEqual([
            ['text', 'Un', 6],
            ['text', 'Deux', 7],
        ]);
    });

    it('lists only the parts, without their texts, when the book has parts', () => {
        const body = layoutBook(
            [post(1, 'Hors partie', 1), post(2, 'Un', 1, 10), post(3, 'Deux', 1, 20)],
            [{id: 10, title: 'Matin'}, {id: 20, title: 'Soir'}],
            options({showToc: false}),
        ).bodyPages;
        expect(tocLinesFromBody(body).map(line => [line.type, line.title, line.page])).toEqual([
            ['part', 'Matin', 7],
            ['part', 'Soir', 9],
        ]);
    });
});

describe('paginateToc', () => {
    const texts = (count: number) => Array.from({length: count}, (_, i) => text(`Texte ${i}`, i));

    it('fits a short table of contents on one page', () => {
        expect(paginateToc(texts(8), limits)).toHaveLength(1);
    });

    it('uses the first-page budget, then the full budget on the next pages', () => {
        expect(paginateToc(texts(25), limits).map(page => page.length)).toEqual([8, 10, 7]);
    });

    it('counts a long title as several lines', () => {
        const pages = paginateToc([text('a'.repeat(60), 1), ...texts(7)], limits);
        expect(pages.map(page => page.length)).toEqual([7, 1]);
    });

    it('adds a blank line above a part title, except at the top of a page', () => {
        const pages = paginateToc([part('Matin', 1), ...texts(3), part('Soir', 5), ...texts(3)], limits);
        // 1 + 3 + (1 blanc + 1) + 3 = 9 lignes > 8 : la dernière ligne passe à la page suivante
        expect(pages.map(page => page.length)).toEqual([7, 1]);
    });

    it('never leaves a part title alone at the bottom of a page', () => {
        const pages = paginateToc([...texts(6), part('Soir', 7), ...texts(3)], limits);
        expect(pages[0]?.at(-1)?.type).toBe('text');
        expect(pages[1]?.[0]?.type).toBe('part');
    });

    it('lists parts one after another, without blank lines, when there are only parts', () => {
        const parts = Array.from({length: 9}, (_, i) => part(`Partie ${i}`, i));
        expect(paginateToc(parts, limits).map(page => page.length)).toEqual([8, 1]);
    });

    it('returns no page when there is no line', () => {
        expect(paginateToc([], limits)).toEqual([]);
    });
});

describe('layoutBook', () => {
    const posts = [post(1, 'Un', 3), post(2, 'Deux', 20), post(3, 'Trois', 3)];
    const numbers = (lines: TocLine[][]) => lines.flat().map(line => line.page);

    it('numbers the body from pageStart when the table of contents is off', () => {
        const layout = layoutBook(posts, [], options({showToc: false}));
        expect(layout.bodyPages[0]?.number).toBe(6);
        expect(layout.tocPages).toEqual([]);
    });

    it('puts the table of contents first and shifts the body after it', () => {
        const layout = layoutBook(posts, [], options({tocPosition: 'start'}));
        expect(layout.firstTocPage).toBe(6);
        expect(layout.bodyPages[0]?.number).toBe(7);
        expect(numbers(layout.tocPages)).toEqual([7, 8, 11]);
    });

    it('shifts the body by as many pages as the table of contents takes', () => {
        const many = Array.from({length: 12}, (_, i) => post(i + 1, `Texte ${i}`, 1));
        const layout = layoutBook(many, [], options({tocPosition: 'start'}));
        expect(layout.tocPages).toHaveLength(2);
        expect(layout.bodyPages[0]?.number).toBe(8);
        expect(layout.tocPages[0]?.[0]?.page).toBe(8);
    });

    it('puts the table of contents after the last page', () => {
        const layout = layoutBook(posts, [], options({tocPosition: 'end'}));
        expect(layout.bodyPages).toHaveLength(5);
        expect(layout.firstTocPage).toBe(11);
        expect(numbers(layout.tocPages)).toEqual([6, 7, 10]);
    });

    it('inserts a numbered title page before each part', () => {
        const withParts = [post(1, 'Un', 3), post(2, 'Deux', 3, 10), post(3, 'Trois', 3, 20)];
        const parts = [{id: 10, title: 'Matin'}, {id: 20, title: 'Soir'}];
        const layout = layoutBook(withParts, parts, options({showToc: false}));
        expect(layout.bodyPages.map(page => page.type === 'part' ? `${page.numeral} ${page.title}` : page.post.postTitle))
            .toEqual(['Un', 'I Matin', 'Deux', 'II Soir', 'Trois']);
        expect(layout.bodyPages.map(page => page.number)).toEqual([6, 7, 8, 9, 10]);
    });

    it('has no table of contents page when the book has no text', () => {
        expect(layoutBook([], [], options()).tocPages).toEqual([]);
    });
});

describe('tocParts', () => {
    it('lists the parts that hold texts, numbered as in the book, from the part of each text only', () => {
        const parts = [{id: 10, title: 'Matin'}, {id: 20, title: 'Vide'}, {id: 30, title: 'Soir'}];
        expect(tocParts([{partId: 30}, {partId: null}, {partId: 10}], parts)).toEqual([
            {title: 'Matin', numeral: 'I'},
            {title: 'Soir', numeral: 'II'},
        ]);
    });
});

describe('landingTocLimit', () => {
    it('keeps a positive whole number', () => {
        expect(landingTocLimit(4)).toBe(4);
        expect(landingTocLimit('4')).toBe(4);
    });

    it('raises zero, negative and decimal values to a whole number of at least 1', () => {
        expect(landingTocLimit(0)).toBe(1);
        expect(landingTocLimit(-3)).toBe(1);
        expect(landingTocLimit(2.7)).toBe(2);
    });

    it('falls back to the default when the value is empty or not a number', () => {
        expect(landingTocLimit('')).toBe(LANDING_TOC_DEFAULT_MAX_PARTS);
        expect(landingTocLimit(undefined)).toBe(LANDING_TOC_DEFAULT_MAX_PARTS);
        expect(landingTocLimit('abc')).toBe(LANDING_TOC_DEFAULT_MAX_PARTS);
    });
});
