<template>
    <NuxtLayout name="admin-page">
        <div class="space-y-6 ">
            <dl class="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
                <div
                    v-for="stat in stats" :key="stat.name"
                    class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
                    <dt class="text-sm/6 font-medium text-gray-500">{{ stat.name }}</dt>
                    <dd :class="[stat.changeType === 'negative' ? 'text-rose-600' : 'text-gray-700', 'text-xs font-medium']">
                        {{ stat.change }}
                    </dd>
                    <dd class="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">{{
                            stat.value
                        }}
                    </dd>
                </div>
            </dl>

            <div class="rounded-lg px-4 sm:px-6 lg:px-8 shadow-sm bg-gray-100 ring-1 ring-gray-950/10 py-10 mt-8 ">
                <div
                    class="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
                    <div
                        v-for="(action, actionIdx) in actions" :key="action.title"
                        :class="[actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '', actionIdx === 1 ? 'sm:rounded-tr-lg' : '', actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '', actionIdx === actions.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '', 'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500']">
                        <div>
                            <span
                                :class="[action.iconBackground, action.iconForeground, 'inline-flex rounded-lg p-3 ring-4 ring-white']">
                                <component :is="action.icon" class="size-6" aria-hidden="true"/>
                            </span>
                        </div>
                        <div class="mt-8">
                            <h3 class="text-base font-semibold text-gray-900">
                                <a :href="action.href" class="focus:outline-none">
                                    <!-- Extend touch target to entire panel -->
                                    <span class="absolute inset-0" aria-hidden="true"/>
                                    {{ action.title }}
                                </a>
                            </h3>
                            <p class="mt-2 text-sm text-gray-500">{{ action.description }}</p>
                        </div>
                        <span
                            class="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
                            aria-hidden="true">
                            <svg class="size-6" fill="currentColor" viewBox="0 0 24 24">
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

<script setup>
import {
    AcademicCapIcon,
    CheckBadgeIcon,
    ClockIcon,
    ReceiptRefundIcon,
} from '@heroicons/vue/24/outline';

const stats = [
    {name: 'Revenue', value: '$405,091.00', change: '+4.75%', changeType: 'positive'},
    {name: 'Overdue invoices', value: '$12,787.00', change: '+54.02%', changeType: 'negative'},
    {name: 'Outstanding invoices', value: '$245,988.00', change: '-1.39%', changeType: 'positive'},
    {name: 'Expenses', value: '$30,156.00', change: '+10.18%', changeType: 'negative'},
];

const actions = [
    {
        title: 'Importat de contenu',
        description: 'Importez vos fichiers (PDF, Word, Markdown) ou flux RSS en un clic ; notre outil détecte automatiquement chapitres et images pour structurer votre projet.',
        href: '#',
        icon: ClockIcon,
        iconForeground: 'text-teal-700',
        iconBackground: 'bg-teal-50',
    },
    {
        title: 'Personnalisation',
        description: 'Choisissez un thème ou appliquez vos propres styles (CSS, polices, marges) via un éditeur WYSIWYG pour un rendu professionnel instantané.',
        href: '#',
        icon: CheckBadgeIcon,
        iconForeground: 'text-purple-700',
        iconBackground: 'bg-purple-50',
    },
    {
        title: 'Métadonnées',
        description: 'Renseignez titre, auteur, description, couverture et ISBN dans un formulaire unique ; toutes les infos sont intégrées à l’EPUB/MOBI.',
        href: '#',
        icon: ReceiptRefundIcon,
        iconForeground: 'text-rose-700',
        iconBackground: 'bg-rose-50',
    },
    {
        title: 'Génération',
        description: 'Exports EPUB, MOBI et PDF optimisés liseuses et mobiles ; récupérez votre ebook via un lien sécurisé dès la conversion terminée.',
        href: '#',
        icon: AcademicCapIcon,
        iconForeground: 'text-indigo-700',
        iconBackground: 'bg-indigo-50',
    },
];
</script>
