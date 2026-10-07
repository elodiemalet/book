// Au-delà de ce nombre de textes, une partie est repliée par défaut dans l'admin
export const COLLAPSE_THRESHOLD = 6;

// Partie repliée ? Le choix enregistré (par clé de partie) prime sur la règle par défaut.
export function isCollapsed(key: string, count: number, saved: Record<string, boolean>): boolean {
    return saved[key] ?? count > COLLAPSE_THRESHOLD;
}
