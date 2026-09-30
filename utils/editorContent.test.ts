// @vitest-environment jsdom
import {describe, expect, it} from 'vitest';
import {editorHtmlToText, textToEditorHtml} from './editorContent';

describe('textToEditorHtml', () => {
    it('fait un paragraphe par ligne, lignes vides comprises', () => {
        expect(textToEditorHtml('Vers un\nVers deux\n\nStrophe deux'))
            .toBe('<p>Vers un</p><p>Vers deux</p><p></p><p>Strophe deux</p>');
    });

    it('garde tel quel un contenu déjà en HTML de blocs', () => {
        expect(textToEditorHtml('<p>déjà</p><p>html</p>')).toBe('<p>déjà</p><p>html</p>');
    });

    it('renvoie une chaîne vide pour un contenu vide', () => {
        expect(textToEditorHtml('')).toBe('');
    });
});

describe('editorHtmlToText', () => {
    it('remet une ligne par paragraphe', () => {
        expect(editorHtmlToText('<p>Vers un</p><p>Vers <strong>deux</strong></p><p></p><p>Strophe deux</p>'))
            .toBe('Vers un\nVers <strong>deux</strong>\n\nStrophe deux');
    });

    it('transforme les retours à la ligne forcés en sauts de ligne', () => {
        expect(editorHtmlToText('<p>un<br>deux</p>')).toBe('un\ndeux');
    });

    it('fait l’aller-retour sans perte', () => {
        const text = 'A\nB\n\nC\n\n\nD';
        expect(editorHtmlToText(textToEditorHtml(text))).toBe(text);
    });
});
