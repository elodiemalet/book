<template>
    <span
        class="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold"
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
                case 'lg':
                case 'xl':
                    return 'px-2.5 py-1 text-sm';
                default:
                    return '';
            }
        },
        severityClass() {
            switch (this.severity) {
                case 'danger':
                    return 'bg-danger-soft text-danger';
                case 'success':
                    return 'bg-menthe-soft text-menthe';
                case 'warning':
                    return 'bg-warning-soft text-warning';
                default:
                    return 'bg-lilas-soft text-lilas-light';
            }
        },
    },
});
</script>
