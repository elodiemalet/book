<template>
    <span
        class="rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
        :class="[
            severityClass,
            sizeClass
        ]"
    >
        <slot>{{ label }}</slot>
    </span>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "BaseBadge",
    props: {
        size: {
            type: [String, null],
            default: null,
        },
        label: {
            type: String,
            default: null,
        },
        severity: {
            type: String,
            default: 'info',
            validator: (value: string) => {
                return ['info', 'danger', 'success', 'warning'].includes(value);
            },
        },
    },
    emits: ['click'],
    computed: {
        sizeClass() {
            switch (this.size) {
                case 'xs':
                    return 'px-2 py-1 text-xs';
                case 'sm':
                    return 'px-2 py-1 text-sm';
                case 'md':
                    return 'px-2.5 py-1.5 text-sm';
                case 'lg':
                    return 'px-3 py-2 text-sm';
                case 'xl':
                    return 'px-3.5 py-2.5 text-sm';
                default:
                    return 'px-3 py-2 ';
            }
        },
        severityClass() {
            switch (this.severity) {
                case 'info':
                    return 'bg-blue-100 text-blue-800';
                case 'danger':
                    return 'bg-red-100 text-red-800';
                case 'success':
                    return 'bg-green-100 text-green-800';
                case 'warning':
                    return 'bg-yellow-100 text-yellow-800';
                default:
                    return 'bg-blue-100 text-blue-800';
            }
        },
    },
});
</script>
