// Ce que le générateur de PDF relève sur la page du livre une fois chargée
export interface BookRender {
    // Nombre d'éléments .page (couverture et pages liminaires comprises)
    pages: number;
    // Nombre de textes du livre (attribut data-book-texts)
    texts: number;
    // Message d'erreur affiché par la page (attribut data-book-error), ou null
    error: string | null;
}

// Raison de ne pas imprimer le livre, ou null s'il est bon à imprimer
export function bookRenderProblem(render: BookRender): string | null {
    if (render.error) {
        return `Le livre n'a pas pu se charger : ${render.error}`;
    }
    if (render.pages === 0) {
        return 'La page du livre n\'a affiché aucune page';
    }
    if (render.texts === 0) {
        return 'Le livre ne contient aucun texte';
    }
    return null;
}
