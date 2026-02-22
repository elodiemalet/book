<template>
    <div class="page text-center flex flex-col gap-4 justify-center relative">
        <slot/>
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
