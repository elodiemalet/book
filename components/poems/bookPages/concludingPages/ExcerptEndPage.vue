<template>
    <!-- Dernière page de l'extrait gratuit, à la place de la 4ᵉ de couverture -->
    <div class="page excerpt-end flex flex-col items-center justify-center gap-6 text-center relative">
        <h2 class="title normal-case italic">Fin de l'extrait</h2>
        <p v-if="remainingLabel">{{ remainingLabel }}</p>
        <ul class="flex flex-col gap-1">
            <li
                v-for="offer in offers"
                :key="offer.id">
                {{ offer.name }} — {{ offer.price }} €
            </li>
        </ul>
        <p class="italic">Retrouvez le livre complet sur notre site.</p>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {landingContent} from "~/utils/landingContent";
import {excerptRemainingLabel} from "~/utils/bookToc";

export default defineComponent({
    props: {
        // Nombre de textes du livre absents de l'extrait
        remaining: {
            type: Number,
            required: true
        },
    },
    computed: {
        remainingLabel(): string {
            return excerptRemainingLabel(this.remaining);
        },
        // Les mêmes éditions et les mêmes prix que sur la page d'accueil
        offers() {
            return landingContent.pricing.offers;
        },
    },
});
</script>
