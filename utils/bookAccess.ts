// Le PDF est généré en ouvrant /book?token=… dans un navigateur sans session : la page transmet
// ce jeton à l'API dans cet en-tête pour lire les textes du livre.
export const BOOK_TOKEN_HEADER = 'x-book-token';

export interface BookAccessContext {
    loggedIn: boolean;
    // True on the client while hydrating a page the server already rendered
    isHydratingServerRender: boolean;
    tokenFromQuery: string;
    // Private runtime config: only readable on the server, undefined on the client
    expectedToken: string | undefined;
}

export function canAccessBook(ctx: BookAccessContext): boolean {
    if (ctx.loggedIn) {
        return true;
    }

    // The server already checked the token when rendering this page;
    // the client cannot re-check it since it has no access to the secret.
    if (ctx.isHydratingServerRender) {
        return true;
    }

    return !!ctx.expectedToken && ctx.tokenFromQuery === ctx.expectedToken;
}
