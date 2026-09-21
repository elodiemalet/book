<template>
    <NuxtLayout name="admin-page">
        <div class="space-y-6 ">
            <div class="bg-white py-24 sm:py-12">
                <div class="mx-auto max-w-7xl px-6 lg:px-8">
                    <div class="mx-auto max-w-2xl lg:max-w-none">
                        <div class="text-center">
                            <h2 class="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                                Optimisez la création de vos e-books
                            </h2>
                            <p class="mt-4 text-lg/8 text-gray-600">Connectez vos contenus via API, organisez
                                vos métadonnées et personnalisez la mise en forme pour générer des e-books
                                professionnels en un clic.</p>
                        </div>
                        <AdminStats/>
                    </div>
                </div>
            </div>

            <div class="rounded-lg px-4 sm:px-6 lg:px-8 shadow-sm bg-gray-100 ring-1 ring-gray-950/10 py-10 mt-8 ">
                <div
                    class="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
                    <div
                        v-for="(action, actionIdx) in actions"
                        :key="action.title"
                        :class="[actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '', actionIdx === 1 ? 'sm:rounded-tr-lg' : '', actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '', actionIdx === actions.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '', 'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500']">
                        <div>
                            <span
                                :class="[action.iconBackground, action.iconForeground, 'inline-flex rounded-lg p-3 ring-4 ring-white']">
                                <component
                                    :is="action.icon"
                                    class="size-6"
                                    aria-hidden="true"/>
                            </span>
                        </div>
                        <div class="mt-8">
                            <h3 class="text-base font-semibold text-gray-900">
                                <router-link
                                    :to="action.href"
                                    :href="action.href">
                                    <!-- Extend touch target to entire panel -->
                                    <span
                                        class="absolute inset-0"
                                        aria-hidden="true"/>
                                    {{ action.title }}
                                </router-link>
                            </h3>
                            <p class="mt-2 text-sm text-gray-500">{{ action.description }}</p>
                        </div>
                        <span
                            class="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
                            aria-hidden="true">
                            <svg
                                class="size-6"
                                fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z"/>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<script lang="ts">
import {
    AcademicCapIcon,
    CheckBadgeIcon,
    ClockIcon,
    ReceiptRefundIcon,
} from '@heroicons/vue/24/outline';
import AdminStats from "~/components/admin/AdminStats.vue";

export default {
    name: "AdminPage",
    components: {AdminStats},
    setup() {
        return {
            actions,
        };
    },
};

const actions = [
    {
        title: 'Importation de contenu',
        description: 'Importez vos fichiers (PDF, Word, Markdown) ou connectez une api en quelques clics.',
        href: '/admin/import',
        icon: ClockIcon,
        iconForeground: 'text-teal-700',
        iconBackground: 'bg-teal-50',
    },
    {
        title: 'Personnalisation',
        description: 'Choisissez un thème ou appliquez vos propres styles (CSS, polices, marges) via un éditeur WYSIWYG pour un rendu professionnel instantané.',
        href: '/admin/import',
        icon: CheckBadgeIcon,
        iconForeground: 'text-purple-700',
        iconBackground: 'bg-purple-50',
    },
    {
        title: 'Métadonnées',
        description: 'Renseignez titre, auteur, description, couverture et ISBN dans un formulaire unique ; toutes les infos sont intégrées à l’EPUB/MOBI.',
        href: '/admin/content',
        icon: ReceiptRefundIcon,
        iconForeground: 'text-rose-700',
        iconBackground: 'bg-rose-50',
    },
    {
        title: 'Génération',
        description: 'Exports EPUB, MOBI et PDF optimisés liseuses et mobiles ; récupérez votre ebook via un lien sécurisé dès la conversion terminée.',
        href: '/admin/book',
        icon: AcademicCapIcon,
        iconForeground: 'text-indigo-700',
        iconBackground: 'bg-indigo-50',
    },
];
</script>
