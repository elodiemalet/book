// URLs (http, https, www) ; la ponctuation finale reste dans le texte
const URL_PATTERN = /[ \t]*(?:https?:\/\/|www\.)[^\s<>"]*[^\s<>".,;:!?)\]»]/gi;
// Emplacements d'images vides laissés par pandoc (« [] »)
const EMPTY_BRACKETS_PATTERN = /[ \t]*\[[ \t]*\]/g;

/**
 * Retire du texte extrait d'un document ce qui n'a rien à faire dans un poème
 * (URLs, restes d'images) avant de l'envoyer à l'IA.
 */
export function cleanTextForAi(text: string): string {
    const lines = text.split(/\r?\n/).flatMap((line) => {
        const cleaned = line
            .replace(URL_PATTERN, '')
            .replace(EMPTY_BRACKETS_PATTERN, '')
            .trimEnd();
        // Une ligne vidée par le nettoyage disparaît, pour ne pas créer de faux saut de strophe
        return cleaned === '' && line.trim() !== '' ? [] : [cleaned];
    });

    return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
