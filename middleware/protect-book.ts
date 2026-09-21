export default defineNuxtRouteMiddleware((to) => {
    const nuxtApp = useNuxtApp();
    const {loggedIn} = useUserSession();

    const allowed = canAccessBook({
        loggedIn: loggedIn.value,
        isHydratingServerRender: import.meta.client && nuxtApp.isHydrating === true && !!nuxtApp.payload.serverRendered,
        tokenFromQuery: (to.query.token as string) || '',
        expectedToken: import.meta.server ? useRuntimeConfig().pdfApiToken : undefined,
    });

    if (!allowed) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        });
    }
});
