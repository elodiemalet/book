<template>
    <div
        class="rounded-lg px-4 py-3 text-sm"
        role="alert"
        :class="classes">
        <div class="flex justify-between items-center">
            <span class="font-medium">{{ title }}</span>
            <button
                type="button"
                class="ms-auto -mr-1.5 inline-flex size-8 items-center justify-center rounded-md opacity-80 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-lilas"
                data-dismiss-target="#alert-1"
                aria-label="Fermer"
                @click="$emit('close')">
                <svg
                    class="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14">
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        </div>
        <slot>{{ message }}</slot>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "AdminAlert",
    props: {
        title: {
            type: String,
            default: null,
        },
        message: {
            type: String,
            default: null,
        },
        severity: {
            type: String,
            default: 'info',
        },
        delay: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['close'],
    computed: {
        classes() {
            return {
                'text-lilas-light bg-lilas-soft': this.severity === 'info',
                'text-danger bg-danger-soft': this.severity === 'danger',
                'text-menthe bg-menthe-soft': this.severity === 'success',
                'text-warning bg-warning-soft': this.severity === 'warning',
                'text-atelier-ink bg-atelier-hover': this.severity === 'default',
            };
        },
    },
    mounted() {
        if (this.delay) {
            setTimeout(() => {
                this.$emit('close');
            }, 3000);
        }
    },

});
</script>
