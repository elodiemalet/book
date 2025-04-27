<template>
    <BaseButton
        class="!bg-transparent !px-0 !text-gray-900 hover:!text-gray-500 focus:!text-gray-500"
        @click="$emit('click')"
    >
        <slot></slot>
    </BaseButton>
</template>

<script lang="ts">
import BaseButton from "~/components/ui/buttons/BaseButton.vue";

export default defineComponent({
    name: "CancelButton",
    components: {BaseButton},
    emits: ['click'],
})
</script>