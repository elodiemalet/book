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

const MONTHS = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];

// Dates reconnues : ISO (2021-03-12), numériques (12/03/2021, 12.03.21) et en toutes lettres (lundi 1er mars 2021)
const ISO_DATE_PATTERN = /(?<!\d)(\d{4})-(\d{2})-(\d{2})(?!\d)/g;
const NUMERIC_DATE_PATTERN = /(?<!\d)(\d{1,2})[/.-](\d{1,2})[/.-](\d{4}|\d{2})(?!\d)/g;
const TEXT_DATE_PATTERN = /(?:(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s+)?(\d{1,2})(?:er)?\s+(janvier|f[ée]vrier|mars|avril|mai|juin|juillet|ao[uû]t|septembre|octobre|novembre|d[ée]cembre)\s+(\d{4})/gi;

// Ce qui peut accompagner l'auteur et la date sur une ligne de signature
const FILLER_WORDS_PATTERN = /\b(?:le|par)\b/gi;
const SEPARATORS_PATTERN = /[\s()[\],.;:/\-–—]+/g;

function normalizeMonth(month: string): number {
    return MONTHS.indexOf(month.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) + 1;
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isAuthorDateLine(line: string, author: string, publishDay: string | null): boolean {
    let hasAuthor = false;
    let hasPublishDate = false;
    const matchDate = (year: number, month: number, day: number) => {
        const fullYear = year < 100 ? 2000 + year : year;
        const isoDay = `${fullYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        hasPublishDate ||= isoDay === publishDay;
        return ' ';
    };

    let rest = line;
    if (author) {
        rest = rest.replace(new RegExp(escapeRegExp(author), 'gi'), () => {
            hasAuthor = true;
            return ' ';
        });
    }
    rest = rest
        .replace(ISO_DATE_PATTERN, (_, y, m, d) => matchDate(+y, +m, +d))
        .replace(NUMERIC_DATE_PATTERN, (_, d, m, y) => matchDate(+y, +m, +d))
        .replace(TEXT_DATE_PATTERN, (_, d, month, y) => matchDate(+y, normalizeMonth(month), +d))
        .replace(FILLER_WORDS_PATTERN, ' ')
        .replace(SEPARATORS_PATTERN, '');

    return rest === '' && (hasAuthor || hasPublishDate);
}

/**
 * Retire du contenu les lignes qui ne donnent que l'auteur et/ou la date de publication
 * (en-tête, signature) : ils sont déjà affichés à partir des champs du post.
 */
export function removeAuthorDateLines(content: string, author: string, publishDate: string | Date): string {
    const isoDate = publishDate instanceof Date ? publishDate.toISOString() : String(publishDate ?? '');
    const publishDay = isoDate.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? null;
    const trimmedAuthor = (author ?? '').trim();

    const lines = content.split(/\r?\n/);
    const kept = lines.filter((line) => line.trim() === '' || !isAuthorDateLine(line, trimmedAuthor, publishDay));
    if (kept.length === lines.length) {
        return content;
    }

    return kept.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
