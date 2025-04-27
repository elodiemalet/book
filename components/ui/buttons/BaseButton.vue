<template>
    <button
        type="button"
        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:bg-indigo-500 disabled:cursor-not-allowed"
        @click="$emit('click')"
    >
        <slot></slot>
    </button>
</template>

<script lang="ts">
export default defineComponent({
    name: "BaseButton",
    emits: ['click'],
})
</script>