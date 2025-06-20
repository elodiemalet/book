<template>
    <div class="p-4 mb-4 text-sm rounded-lg" role="alert"
         :class="classes">
        <div class="flex justify-between items-center">
            <span class="font-medium">{{ title }}</span>
            <button type="button"
                    class="ms-auto -mx-1.5 -my-1.5  rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8"
                    data-dismiss-target="#alert-1" aria-label="Close"
                    @click="$emit('close')">
                <span class="sr-only">Close</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
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
    mounted() {
        if (this.delay) {
            setTimeout(() => {
                this.$emit('close');
            }, 3000);
        }
    },
    computed: {
        classes() {
            return {
                'text-blue-800 bg-blue-50': this.severity === 'info',
                'text-red-800 bg-red-50': this.severity === 'danger',
                'text-green-800 bg-green-50': this.severity === 'success',
                'text-yellow-800 bg-yellow-50': this.severity === 'warning',
                'text-gray-800 bg-gray-50': this.severity === 'default',
            };
        },
    },

});
</script>
