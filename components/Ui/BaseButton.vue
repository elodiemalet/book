<template>
    <button type="button"
            class="mt-2 text-white bg-gradient-to-br bg-purple-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-3 py-2 text-xs text-left me-2 mb-2"
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