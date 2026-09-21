import {describe, expect, it} from 'vitest';
import {formatSignature} from './signature';

describe('formatSignature', () => {
    it('affiche l’auteur puis la date en toutes lettres', () => {
        expect(formatSignature('J.D.', new Date(2022, 7, 29))).toBe('J.D. le lundi 29 août 2022');
    });

    it('écrit « 1er » pour le premier du mois', () => {
        expect(formatSignature('J.D.', new Date(2021, 2, 1))).toBe('J.D. le lundi 1er mars 2021');
    });
});
