<template>
    <button type="button"
            class="rounded-full bg-lime-600 p-2 text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            @click="$emit('click')"
    >
        <PencilIcon class="size-5" aria-hidden="true"/>
    </button>
</template>

<script lang="ts">
import {PencilIcon} from '@heroicons/vue/20/solid'

export default defineComponent({
    name: "EditRoundButton",
    components: {PencilIcon},
    emits: ['click'],
})
</script>