export default defineEventHandler(async (event) => {
    if (isPublicRoute(event.method, event.path)) {
        return;
    }

    await requireUserSession(event);
});
