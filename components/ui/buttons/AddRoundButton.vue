<template>
    <button
        type="button"
        class="rounded-full bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        @click="$emit('click')"
    >
        <PlusIcon
            class="size-5"
            aria-hidden="true"/>
    </button>
</template>

<script lang="ts">
import {PlusIcon} from '@heroicons/vue/20/solid';

export default defineComponent({
    name: "AddButton",
    components: {PlusIcon},
    emits: ['click'],
});
</script>
