import {describe, expect, it} from 'vitest';
import {cleanTextForAi} from './textCleaner';

describe('cleanTextForAi', () => {
    it('supprime une ligne ne contenant qu’une URL sans laisser de ligne vide', () => {
        const text = 'J.D. (le 12 mars 2021)\n\nhttps://exemple.fr/video\n12/03/2021 - J.D.';

        expect(cleanTextForAi(text)).toBe('J.D. (le 12 mars 2021)\n\n12/03/2021 - J.D.');
    });

    it('ne crée pas de saut de strophe quand une URL est au milieu d’une strophe', () => {
        const text = 'premier vers\nhttp://exemple.fr/page?x=1\nsecond vers';

        expect(cleanTextForAi(text)).toBe('premier vers\nsecond vers');
    });

    it('retire une URL en ligne en gardant le texte autour', () => {
        expect(cleanTextForAi('à voir sur https://exemple.fr ce soir')).toBe('à voir sur ce soir');
        expect(cleanTextForAi('site : www.exemple.fr')).toBe('site :');
    });

    it('retire les emplacements d’images vides laissés par pandoc', () => {
        const text = 'premier vers\n[]\nsecond vers\nun [ ] au milieu';

        expect(cleanTextForAi(text)).toBe('premier vers\nsecond vers\nun au milieu');
    });

    it('conserve les vers, les crochets non vides et les sauts de strophe', () => {
        const text = 'strophe un\nvers deux […]\n\nstrophe deux';

        expect(cleanTextForAi(text)).toBe(text);
    });

    it('réduit les lignes vides multiples et supprime les espaces en fin de ligne', () => {
        const text = '\n\nun vers   \n\n\n\nun autre\t\n\n';

        expect(cleanTextForAi(text)).toBe('un vers\n\nun autre');
    });
});
