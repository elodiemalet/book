import {describe, expect, it} from 'vitest';
import {paginationItems} from './pagination';

describe('paginationItems', () => {
    it('ne renvoie rien sans page', () => {
        expect(paginationItems(1, 0)).toEqual([]);
    });

    it('affiche toutes les pages quand il y en a peu', () => {
        expect(paginationItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
        expect(paginationItems(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('affiche la première, la dernière et les voisines de la page courante', () => {
        expect(paginationItems(12, 24)).toEqual([1, '...', 11, 12, 13, '...', 24]);
    });

    it('gère les pages proches des extrémités', () => {
        expect(paginationItems(1, 24)).toEqual([1, 2, '...', 24]);
        expect(paginationItems(24, 24)).toEqual([1, '...', 23, 24]);
    });

    it('affiche la page manquante plutôt qu’un « ... » pour une seule page', () => {
        expect(paginationItems(4, 24)).toEqual([1, 2, 3, 4, 5, '...', 24]);
        expect(paginationItems(21, 24)).toEqual([1, '...', 20, 21, 22, 23, 24]);
    });
});
