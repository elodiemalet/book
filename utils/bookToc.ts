import type PostEntity from "../entities/PostEntity";
import {paginatePosts, visualLineCount, type BookPaginationLimits} from "./bookPagination";
import {toRoman} from "./roman";

export type TocPosition = 'start' | 'end';

// Une partie du livre, déjà triée dans l'ordre des parties
export interface BookPart {
    id: number;
    title: string;
}

export interface BookLayoutOptions {
    limits: BookPaginationLimits;
    // Numéro de la première page après les pages liminaires (couverture, faux-titre, dédicace, préface)
    pageStart: number;
    showToc: boolean;
    tocPosition: TocPosition;
}

// Une page du corps du livre : page intercalaire d'une partie, ou page d'un texte
export type BodyPage =
    | { type: 'part'; partId: number; title: string; numeral: string; number: number }
    | { type: 'text'; post: PostEntity; number: number };

// Une ligne du sommaire : titre de partie, ou titre de texte
export type TocLine =
    | { type: 'part'; partId: number; title: string; numeral: string; page: number }
    | { type: 'text'; postId: number | null; title: string; page: number };

export interface BookLayout {
    bodyPages: BodyPage[];
    // Lignes du sommaire, découpées page par page. Vide si le sommaire est désactivé.
    tocPages: TocLine[][];
    firstTocPage: number;
}

// Ce qu'il faut savoir d'un texte pour le ranger : sa partie et sa place dans la partie
export interface PartMember {
    partId?: number | null;
    position?: number;
}

export interface BookSection<T extends PartMember = PostEntity> {
    part: BookPart | null;
    numeral: string;
    posts: T[];
}

// Place réservée sur chaque ligne pour les points de conduite et le numéro de page
export const TOC_PAGE_NUMBER_CHARS = 6;

// Dans un titre, « _ » sépare le titre du sous-titre : seul le titre va au sommaire
export function tocTitle(postTitle: string): string {
    return (postTitle.split('_')[0] ?? '').trim();
}

// Ordre des textes dans une partie : par position, puis dans l'ordre reçu (le plus récent d'abord)
export function sortByPosition<T extends { position?: number }>(posts: T[]): T[] {
    return [...posts].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

// Répartit les textes par partie, dans l'ordre du livre. Les textes sans partie (ou rattachés
// à une partie inconnue) viennent en tête. Une partie vide n'apparaît pas et n'est pas numérotée.
export function groupByPart<T extends PartMember>(posts: T[], parts: BookPart[]): BookSection<T>[] {
    const knownIds = new Set(parts.map(part => part.id));
    const sections: BookSection<T>[] = [];

    const loose = sortByPosition(posts).filter(post => post.partId === null || post.partId === undefined || !knownIds.has(post.partId));
    if (loose.length) {
        sections.push({part: null, numeral: '', posts: loose});
    }

    let partNumber = 0;
    for (const part of parts) {
        const partPosts = sortByPosition(posts.filter(post => post.partId === part.id));
        if (partPosts.length) {
            partNumber++;
            sections.push({part, numeral: toRoman(partNumber), posts: partPosts});
        }
    }

    return sections;
}

// Le sommaire se lit dans les pages du corps. Un livre en parties ne liste que ses parties ;
// sinon, une ligne par texte (sa première page).
export function tocLinesFromBody(bodyPages: BodyPage[]): TocLine[] {
    const hasParts = bodyPages.some(page => page.type === 'part');
    const lines: TocLine[] = [];
    bodyPages.forEach((page, i) => {
        if (page.type === 'part') {
            lines.push({type: 'part', partId: page.partId, title: page.title, numeral: page.numeral, page: page.number});
            return;
        }
        if (hasParts) {
            return;
        }
        const previous = bodyPages[i - 1];
        if (previous?.type === 'text' && previous.post.id === page.post.id) {
            return;
        }
        lines.push({type: 'text', postId: page.post.id, title: tocTitle(page.post.postTitle), page: page.number});
    });
    return lines;
}

export function tocLineLabel(line: TocLine): string {
    return line.type === 'part' ? `${line.numeral} — ${line.title}` : line.title;
}

// Une ligne de blanc sépare un titre de partie des textes de la partie précédente (jamais en haut de page)
export function tocLineHasBlankAbove(line: TocLine, previous: TocLine | undefined): boolean {
    return line.type === 'part' && previous?.type === 'text';
}

// Découpe le sommaire en pages. La première page porte le titre « Sommaire », elle a donc le même
// budget que la première page d'un texte. Un titre de partie qui suit des textes prend une ligne
// de blanc au-dessus (sauf en haut de page) et ne reste jamais seul en bas d'une page avant ses textes.
export function paginateToc(lines: TocLine[], limits: BookPaginationLimits): TocLine[][] {
    const pages: TocLine[][] = [];
    const charsPerLine = Math.max(1, limits.maxCharsPerLine - TOC_PAGE_NUMBER_CHARS);
    const cost = (line: TocLine, previous: TocLine | undefined) =>
        visualLineCount(tocLineLabel(line), charsPerLine) + (tocLineHasBlankAbove(line, previous) ? 1 : 0);

    let i = 0;
    while (i < lines.length) {
        const budget = pages.length === 0 ? limits.maxLinesFirstPage : limits.maxLines;
        const page: TocLine[] = [];
        let used = 0;

        while (i < lines.length) {
            const line = lines[i] as TocLine;
            const lineCost = cost(line, page[page.length - 1]);
            if (used + lineCost > budget && page.length > 0) {
                break;
            }
            page.push(line);
            used += lineCost;
            i++;
        }

        if (page.length > 1 && page[page.length - 1]?.type === 'part' && lines[i]?.type === 'text') {
            page.pop();
            i--;
        }
        pages.push(page);
    }

    return pages;
}

// Pagine le livre (parties et textes) et place le sommaire. Au début, le sommaire décale les numéros
// du corps du nombre de pages qu'il occupe ; à la fin, il suit la dernière page du dernier texte.
// Les pages intercalaires des parties comptent dans la numérotation.
export function layoutBook(posts: PostEntity[], parts: BookPart[], options: BookLayoutOptions): BookLayout {
    type Unnumbered = { type: 'part'; partId: number; title: string; numeral: string } | { type: 'text'; post: PostEntity };
    const items: Unnumbered[] = [];

    for (const section of groupByPart(posts, parts)) {
        if (section.part) {
            items.push({type: 'part', partId: section.part.id, title: section.part.title, numeral: section.numeral});
        }
        for (const post of paginatePosts(section.posts, options.limits)) {
            items.push({type: 'text', post});
        }
    }

    const numbered = (firstPage: number): BodyPage[] => items.map((item, i) => ({...item, number: firstPage + i}));

    if (!options.showToc || items.length === 0) {
        return {bodyPages: numbered(options.pageStart), tocPages: [], firstTocPage: options.pageStart};
    }

    // Le découpage du sommaire ne dépend que des titres : on peut compter ses pages avant de numéroter
    const tocPageCount = paginateToc(tocLinesFromBody(numbered(0)), options.limits).length;

    const firstBodyPage = options.tocPosition === 'start' ? options.pageStart + tocPageCount : options.pageStart;
    const bodyPages = numbered(firstBodyPage);

    return {
        bodyPages,
        tocPages: paginateToc(tocLinesFromBody(bodyPages), options.limits),
        firstTocPage: options.tocPosition === 'start' ? options.pageStart : firstBodyPage + bodyPages.length,
    };
}

// Le sommaire de la page d'accueil : les parties qui contiennent des textes, avec leur numéro.
// Il suffit de la partie de chaque texte : le contenu des textes n'a pas à être lu.
export function tocParts(posts: PartMember[], parts: BookPart[]): { title: string; numeral: string }[] {
    return groupByPart(posts, parts)
        .filter(section => section.part)
        .map(section => ({title: section.part?.title ?? '', numeral: section.numeral}));
}

// Nombre de parties affichées par défaut sur la page d'accueil
export const LANDING_TOC_DEFAULT_MAX_PARTS = 6;

// Nombre de parties à afficher sur la page d'accueil : un entier d'au moins 1.
// Champ vide ou valeur illisible : la valeur par défaut.
export function landingTocLimit(value: unknown): number {
    const number = typeof value === 'number' ? value : (typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN);
    if (!Number.isFinite(number)) {
        return LANDING_TOC_DEFAULT_MAX_PARTS;
    }
    return Math.max(1, Math.floor(number));
}
