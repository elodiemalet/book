import {describe, expect, it} from 'vitest';
import {cleanTextForAi, removeAuthorDateLines} from './textCleaner';

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

describe('removeAuthorDateLines', () => {
    it('retire l’en-tête et la signature auteur/date, affichés séparément', () => {
        const content = 'J.D. (le 12 mars 2021)\n\npremier vers\nsecond vers\n\n12/03/2021 - J.D.';

        expect(removeAuthorDateLines(content, 'J.D.', '2021-03-12')).toBe('premier vers\nsecond vers');
    });

    it('retire une ligne auteur/date au milieu sans laisser de ligne vide en trop', () => {
        const content = 'strophe un\n\nJ.D. (le 12 mars 2021)\n\nstrophe deux';

        expect(removeAuthorDateLines(content, 'J.D.', '2021-03-12')).toBe('strophe un\n\nstrophe deux');
    });

    it('reconnaît les différents formats de date de publication', () => {
        const content = [
            'vers',
            'lundi 1er mars 2021',
            '01/03/21',
            '2021-03-01',
            'le 01.03.2021',
            'Par J.D.',
        ].join('\n');

        expect(removeAuthorDateLines(content, 'J.D.', '2021-03-01')).toBe('vers');
    });

    it('reconnaît les mois accentués', () => {
        expect(removeAuthorDateLines('vers\nle 15 août 2020', 'J.D.', '2020-08-15')).toBe('vers');
        expect(removeAuthorDateLines('vers\n(3 février 2020)', 'J.D.', '2020-02-03')).toBe('vers');
    });

    it('garde les vers qui citent l’auteur ou une autre date', () => {
        const content = 'J.D. marche sous la pluie\n14 juillet 1789\nle 12 mars 2021 il pleuvait';

        expect(removeAuthorDateLines(content, 'J.D.', '2021-03-12')).toBe(content);
    });

    it('ne retire rien quand l’auteur et la date sont inconnus', () => {
        const content = 'vers\n\n12/03/2021';

        expect(removeAuthorDateLines(content, '', '')).toBe(content);
    });
});
