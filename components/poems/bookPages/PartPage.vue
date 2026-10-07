<template>
    <!-- Page intercalaire d'une partie : comptée dans la numérotation, mais sans folio imprimé -->
    <div class="page flex flex-col items-center justify-center gap-4 text-center relative">
        <span class="title text-2xl tracking-[0.2em]">{{ numeral }}</span>
        <h2 class="title normal-case italic">{{ title }}</h2>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    props: {
        numeral: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
    },
});
</script>
