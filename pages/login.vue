<template>
    <LoginForm
        v-model:credentials="credentials"
        @submit="submit"
    />
</template>

<script lang="ts">
import type {User} from "#auth-utils";

export default {
    name: "LoginPage",
    setup() {
        definePageMeta({layout: 'login'});
    },
    data() {
        return {
            toast: useToast(),
            credentials: {
                email: 'admin@admin.com',
                password: 'iamtheadmin',
            },
            user: null as User | null,
            loggedIn: false,
        };
    },
    mounted() {
        this.refreshSession();
    },
    methods: {
        async refreshSession() {
            const {loggedIn, user} = useUserSession();
            this.loggedIn = loggedIn.value;
            this.user = user.value;
        },
        async submit() {
            const {error} = await useFetch('/api/login', {
                method: 'POST',
                body: JSON.stringify(this.credentials),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (error.value) {
                this.toast.add({
                    id: 'error',
                    icon: 'i-material-symbols-file-download-off',
                    title: 'Erreur lors de la connexion',
                    color: 'red',

                });
                return;
            }

            const {fetch: refreshSession} = useUserSession();
            await refreshSession();
            await navigateTo('/admin');
        }
    }
};
</script>
