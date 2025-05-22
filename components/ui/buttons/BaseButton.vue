<template>
    <button
        type="button"
        class="rounded-md  px-3 py-2 font-semibold shadow-xs disabled:cursor-not-allowed"
        :class="outlined ? 'border text-purple-800 border-purple-600 bg-white hover:bg-purple-50' : 'bg-purple-600 hover:bg-purple-500 text-white'"
        @click="$emit('click')"
    >
        <slot/>
    </button>
</template>

<script lang="ts">
export default defineComponent({
    name: "BaseButton",
    props: {
        outlined: {
            type: Boolean,
            default: false,
        }
    },
    emits: ['click']
});
</script>
