// Assertions promptfoo sur le post extrait d'un fichier.
// Chaque cas de test fournit dans ses vars : title, author, date, content (résultat attendu).

// Différences de mise en forme qu'on accepte : fins de ligne, espaces en fin de ligne,
// lignes vides en trop, apostrophes typographiques (Pandoc transforme ' en ’).
function normalize(text) {
    return String(text ?? '')
        .replace(/\r\n?/g, '\n')
        .replace(/[’‘]/g, "'")
        .replace(/[ \t]+$/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function post(output) {
    return typeof output === 'string' ? JSON.parse(output) : output;
}

function sameField(field, label) {
    return (output, {vars}) => {
        const actual = normalize(post(output)[field]);
        const expected = normalize(vars[label]);
        return {
            pass: actual === expected,
            score: actual === expected ? 1 : 0,
            reason: actual === expected ? `${field} correct` : `${field} : attendu « ${expected} », obtenu « ${actual} »`,
        };
    };
}

export const titre = sameField('postTitle', 'title');
export const auteur = sameField('author', 'author');
export const date = sameField('publishDate', 'date');

// Le contenu doit être identique au mot près ; en cas d'écart on montre la première ligne qui diffère
export function contenu(output, {vars}) {
    const actual = normalize(post(output).content).split('\n');
    const expected = normalize(vars.content).split('\n');
    const lines = Math.max(actual.length, expected.length);
    for (let i = 0; i < lines; i++) {
        if (actual[i] !== expected[i]) {
            return {
                pass: false,
                score: i / lines,
                reason: `Ligne ${i + 1} : attendu « ${expected[i] ?? '(fin du texte)'} », obtenu « ${actual[i] ?? '(fin du texte)'} »`,
            };
        }
    }
    return {pass: true, score: 1, reason: 'Contenu identique'};
}

// Restes de mise en forme ou de liens qui ne doivent jamais arriver dans le livre
const LEFTOVERS = [
    [/[*#_`]/, 'caractère de mise en forme (*, #, _, `)'],
    [/^\s*(?:-{3,}|\*(?:\s*\*){2,})\s*$/m, 'séparateur décoratif'],
    [/https?:\/\/|www\./i, 'URL'],
    [/\[(?:image|\s*)\]/i, 'reste d’image'],
];

export function sansResidus(output) {
    const content = String(post(output).content ?? '');
    const found = LEFTOVERS.filter(([pattern]) => pattern.test(content)).map(([, label]) => label);
    return {
        pass: found.length === 0,
        score: found.length === 0 ? 1 : 0,
        reason: found.length === 0 ? 'Aucun résidu' : `Résidus trouvés : ${found.join(', ')}`,
    };
}
