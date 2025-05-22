export default defineNuxtRouteMiddleware((to) => {
    const config = useRuntimeConfig();
    const tokenFromQuery = (to.query.token as string) || '';
    const {loggedIn} = useUserSession();

    if (loggedIn.value) {
        return;
    }

    if (tokenFromQuery !== config.public.pdfApiToken) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        });
    }

    return;
});
