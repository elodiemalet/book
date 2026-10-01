import {describe, expect, it} from 'vitest';
import {bookRenderProblem} from './bookRenderCheck';

describe('bookRenderProblem', () => {
    it('accepts a book with pages and texts', () => {
        expect(bookRenderProblem({pages: 12, texts: 8, error: null})).toBeNull();
    });

    it('reports the error shown by the book page', () => {
        expect(bookRenderProblem({pages: 0, texts: 0, error: 'Lecture des textes refusée'}))
            .toBe('Le livre n\'a pas pu se charger : Lecture des textes refusée');
    });

    it('reports a book that rendered no page', () => {
        expect(bookRenderProblem({pages: 0, texts: 0, error: null})).toBe('La page du livre n\'a affiché aucune page');
    });

    it('reports a book without any text, even with its preliminary pages', () => {
        expect(bookRenderProblem({pages: 3, texts: 0, error: null})).toBe('Le livre ne contient aucun texte');
    });
});
