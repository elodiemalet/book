<script setup lang="ts">

</script>

<template>
    <div class="page w-a4 h-a4 text-left flex flex-col gap-4 justify-center pb-10 relative">

        <div v-if="prevPageId !== id">
            <h2 class="text-left pl-10 flex normal-case">
                <span
                    v-for="(titleLine, i) in contentSplit(title)"
                    :key="titleLine"
                >
                        <span v-if="i === 0">
                            {{ titleLine }}
                        </span>
                        <span v-else class="italic">
                            ~ {{ titleLine }}
                        </span>
                </span>
            </h2>
        </div>
        <header
            class="text-gray-500 italic flex gap-4 normal-case"
            v-else
        >
            <div v-for="titleLine in contentSplit(title)">
                {{ titleLine }}
            </div>
        </header>
        <div>
            <div
                v-for="contentLine in contentLines"
                :key="contentLine"
                :class="contentSplit(contentLine)?.length > 1 ? 'grid grid-cols-2 gap-6' : ''"

            >
                <div class="min-h-4 first-letter:uppercase"
                     v-for="contentLinePart in contentSplit(contentLine)">
                    {{ contentLinePart }}
                </div>
            </div>
        </div>
        <div
            class="mt-10 font-medium text-left pl-10"
            v-if="nextPageId !== id"
        >
            {{ author }} le {{ dateFormatted }}
        </div>
        <footer>
            {{ page }}
        </footer>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
    props: {
        id: {
            type: Number,
            required: true
        },
        nextPageId: {
            type: Number,
            required: true
        },
        prevPageId: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        page: {
            type: Number,
            required: true
        },
    },
    methods: {
        contentSplit(contentLine: string) {
            return contentLine.split('_');
        }
    },
    computed: {
        contentLines() {
            //keep the line breaks and the empty lines
            return this.content.split('\n');
        },
        dateFormatted() {
            const date = this.date;
            // Récupération du jour (chiffre), du mois (en toutes lettres) et du jour de la semaine
            const dayNumber = date.getDate(); // ex. 1, 2, 3...
            const monthLong = new Intl.DateTimeFormat('fr-FR', {month: 'long'}).format(date);   // ex. "mai"
            const weekdayLong = new Intl.DateTimeFormat('fr-FR', {weekday: 'long'}).format(date); // ex. "lundi"
            const year = date.getFullYear(); // ex. 2021

            // Conversion du "1" en "1er"
            const dayString = dayNumber === 1 ? '1er' : dayNumber;

            // Construction de la chaîne finale
            return `${weekdayLong} ${dayString} ${monthLong} ${year}`;
        }
    }
})

</script>


<style scoped>

</style>
