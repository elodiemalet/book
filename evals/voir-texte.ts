// Affiche le texte envoyé à l'IA pour un fichier (après Pandoc et nettoyage),
// pour écrire le résultat attendu d'un nouveau cas de test.
// Usage : npx tsx evals/voir-texte.ts evals/fixtures/mon-fichier.odt
import fs from 'node:fs';
import {extractWithPandoc} from '../server/services/pandoc';
import {cleanTextForAi} from '../server/services/textCleaner';

const file = process.argv[2];
if (!file) {
    console.error('Usage : npx tsx evals/voir-texte.ts <fichier>');
    process.exit(1);
}
const extension = file.split('.').pop() || '';
console.log(cleanTextForAi(await extractWithPandoc(fs.readFileSync(file), extension)));
