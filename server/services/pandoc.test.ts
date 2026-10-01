import {execFileSync} from 'child_process';
import fs from 'fs';
import tmp from 'tmp';
import {describe, expect, it} from 'vitest';
import {extractWithPandoc} from './pandoc';

function hasPandoc() {
    try {
        execFileSync('pandoc', ['--version']);
        return true;
    } catch {
        return false;
    }
}

// Image PNG 1x1 pour construire un .docx de test avec pandoc
const PNG_1PX = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

describe.skipIf(!hasPandoc())('extractWithPandoc', () => {
    it('retire les images, leurs légendes et les adresses des liens', async () => {
        const dir = tmp.dirSync({unsafeCleanup: true});
        fs.writeFileSync(`${dir.name}/img.png`, Buffer.from(PNG_1PX, 'base64'));
        fs.writeFileSync(`${dir.name}/doc.md`, [
            'Titre',
            '',
            '![Une image contenant texte, capture d’écran](img.png)',
            '',
            'Voir [la vidéo](https://exemple.fr/video) ici ![](img.png)',
            '',
            '12/03/2021 - J.D.',
        ].join('\n'));
        execFileSync('pandoc', ['doc.md', '-o', 'doc.docx'], {cwd: dir.name});

        const text = await extractWithPandoc(fs.readFileSync(`${dir.name}/doc.docx`), 'docx');
        dir.removeCallback();

        expect(text).not.toContain('capture');
        expect(text).not.toContain('exemple.fr');
        expect(text).not.toContain('[]');
        expect(text).toContain('Voir la vidéo ici');
        expect(text).toContain('12/03/2021 - J.D.');
    });
});

describe.skipIf(!hasPandoc())('extractWithPandoc (Markdown)', () => {
    it('lit les .md en gardant les vers, les apostrophes et sans les séparateurs', async () => {
        const markdown = [
            '# Titre',
            '',
            "*Premier* vers d'un poème,",
            'second **vers**.',
            '',
            '* * *',
            '',
            'Dernier vers.',
        ].join('\n');

        const text = await extractWithPandoc(Buffer.from(markdown), 'md');

        expect(text).toContain("Premier vers d'un poème,\nsecond vers.");
        expect(text).toContain('Dernier vers.');
        expect(text).not.toMatch(/[-*]{3,}/);
    });
});

describe('extractWithPandoc (texte brut)', () => {
    it('renvoie le contenu d’un .txt tel quel, fins de ligne normalisées', async () => {
        const text = await extractWithPandoc(Buffer.from('﻿Titre\r\n\r\n*Vers* un,\r\nvers deux.'), 'txt');

        expect(text).toBe('Titre\n\n*Vers* un,\nvers deux.');
    });

    it('regroupe en strophes les vers d’un ODT/DOCX séparés par des paragraphes « * »', async () => {
        const dir = tmp.dirSync({unsafeCleanup: true});
        fs.writeFileSync(`${dir.name}/doc.md`, ['Titre', '*', 'Vers un', 'Vers deux', '*', 'Vers trois', 'Vers quatre'].join('\n\n').replace(/^\*$/gm, '\\*'));
        execFileSync('pandoc', ['doc.md', '-o', 'doc.docx'], {cwd: dir.name});

        const text = await extractWithPandoc(fs.readFileSync(`${dir.name}/doc.docx`), 'docx');
        dir.removeCallback();

        expect(text.trim()).toBe('Titre\n\nVers un\nVers deux\n\nVers trois\nVers quatre');
    });
});
