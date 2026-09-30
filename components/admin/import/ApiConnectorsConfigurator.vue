<template>
    <ul
        role="list"
        class="grid grid-cols-1 gap-4 lg:grid-cols-3"
    >
        <li
            v-for="connector in connectors"
            :key="connector.id"
            class="flex items-center gap-4 rounded-[10px] border border-atelier-line bg-atelier-panel p-4"
        >
            <img
                :src="connector.imageUrl"
                alt=""
                class="size-11 flex-none rounded-lg bg-page object-contain p-1.5"
            >
            <div class="flex min-w-0 flex-1 flex-col gap-0.5">
                <span class="text-sm font-semibold text-atelier-ink">{{ connector.name }}</span>
                <span class="text-xs text-atelier-subtle">{{ connector.description }}</span>
            </div>
            <span class="shrink-0 rounded border border-atelier-line-strong px-2 py-0.5 text-[11px] text-atelier-muted">Bientôt</span>
        </li>
    </ul>
</template>

<script lang="ts">
import {defineComponent} from "vue";

// Connecteurs affichés à titre indicatif : aucun import n'est encore branché derrière.
export default defineComponent({
    name: "ApiConnectorsConfigurator",
    data() {
        return {
            connectors: [
                {
                    id: '1',
                    name: 'Google Drive',
                    description: 'Importer des fichiers Google Drive',
                    imageUrl: '/images/connectors-logos/google-drive.png',
                },
                {
                    id: '2',
                    name: 'Contentful',
                    description: 'Importer des contenus Contentful',
                    imageUrl: '/images/connectors-logos/contentful.svg',
                },
                {
                    id: '3',
                    name: 'WordPress',
                    description: 'Importer des contenus WordPress',
                    imageUrl: '/images/connectors-logos/wordpress.png',
                },
            ],
        };
    },
});
</script>
