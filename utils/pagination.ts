export type PaginationItem = number | '...';

// Nombre de pages en dessous duquel on les affiche toutes
const MAX_PAGES_WITHOUT_ELLIPSIS = 7;

/**
 * Pages à afficher dans la pagination : la première, la dernière et les voisines
 * de la page courante, séparées par « ... » quand des pages sont masquées.
 */
export function paginationItems(page: number, countPage: number): PaginationItem[] {
    if (countPage <= MAX_PAGES_WITHOUT_ELLIPSIS) {
        return Array.from({length: countPage}, (_, i) => i + 1);
    }

    const shown = [...new Set([1, page - 1, page, page + 1, countPage])]
        .filter((p) => p >= 1 && p <= countPage)
        .sort((a, b) => a - b);

    const items: PaginationItem[] = [];
    let previous = 0;
    for (const p of shown) {
        if (p - previous === 2) {
            // Une seule page masquée : autant l'afficher
            items.push(previous + 1);
        } else if (p - previous > 2) {
            items.push('...');
        }
        items.push(p);
        previous = p;
    }

    return items;
}
