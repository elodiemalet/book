export default defineNuxtRouteMiddleware((to) => {
    const {loggedIn} = useUserSession();

    if (to.fullPath === '/login') {
        // stop the middleware if the user is already on the login page
        return;
    }

    // redirect the user to the login screen if they're not authenticated
    if (!loggedIn.value) {
        return navigateTo('/login');
    }
});
