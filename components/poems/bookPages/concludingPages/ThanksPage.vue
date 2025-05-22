<template>
    <div class="page w-a4 h-a4 text-left flex flex-col gap-4 justify-center pb-10">

        <div><h1 class="title">Remerciements</h1></div>
        <div>
            Je tiens à remercier toutes les personnes qui m'ont soutenu dans la réalisation de ce recueil de poèmes.
        </div>
        <footer v-if="page">
            {{ page }}
        </footer>

    </div>

</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    props: {
        page: {
            type: [Number, null],
            default: null
        }
    }
});

</script>

<style scoped>

</style>
