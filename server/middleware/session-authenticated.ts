export default defineEventHandler(async (event) => {
    if (isPublicRoute(event.method, event.path)) {
        return;
    }

    // Génération du PDF : la page du livre lit les textes et les parties avec le jeton, sans session
    if (acceptsBookToken(event.method, event.path)
        && hasValidBookToken(getHeader(event, BOOK_TOKEN_HEADER), useRuntimeConfig().pdfApiToken)) {
        return;
    }

    await requireUserSession(event);
});
