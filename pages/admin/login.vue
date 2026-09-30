<template>
    <LoginForm
        v-model:credentials="credentials"
        :error="errorMessage"
        :loading="submitting"
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
                email: '',
                password: '',
            },
            user: null as User | null,
            loggedIn: false,
            errorMessage: '',
            submitting: false,
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
            this.errorMessage = '';
            if (!this.credentials.email || !this.credentials.password) {
                this.errorMessage = 'Renseignez votre adresse e-mail et votre mot de passe.';
                return;
            }
            this.submitting = true;
            const {error} = await useFetch('/api/login', {
                method: 'POST',
                body: JSON.stringify(this.credentials),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (error.value) {
                this.submitting = false;
                this.errorMessage = 'Identifiants incorrects. Vérifiez l\'adresse et le mot de passe.';
                this.toast.add({
                    id: 'error',
                    icon: 'i-material-symbols-file-download-off',
                    title: 'Erreur lors de la connexion',
                    color: 'error',

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
