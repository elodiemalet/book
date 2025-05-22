<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4 no-print">
        <!-- Titre selon le code d’erreur -->
        <h1 class="text-4xl font-bold mb-2">
            <span v-if="error.statusCode === 500">Erreur interne du serveur</span>
            <span v-else-if="error.statusCode === 404">Page non trouvée</span>
            <span v-else>Oups ! Quelque chose a cassé…</span>
        </h1>
        <!-- Détail du message d’erreur -->
        <p class="mb-4">{{ error.message || 'Une erreur est survenue.' }}</p>
        <!-- Lien de retour -->
        <NuxtLink to="/" class="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700">
            Retour à l’accueil
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    error: { statusCode: number; message: string }
}>();
</script>

<style scoped>
/* Ton styling, Tailwind est facultatif ici */
</style>
