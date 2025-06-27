<template>
    <button
        type="button"
        class="rounded-md font-semibold shadow-xs disabled:cursor-not-allowed"
        :class="
            [
                severityClass,
                loading ? 'cursor-not-allowed bg-opacity-75' : '',
                sizeClass
            ]"
        :disabled="loading"
        @click="$emit('click')"
    >
        <span class="flex items-center">
            <arrow-path-icon
                v-if="loading"
                class="animate-spin h-5 w-5 mr-2"
                aria-hidden="true"
            />
            <span>
                <slot>{{ label }}</slot>
            </span>
        </span>
    </button>
</template>

<script lang="ts">
import ArrowPathIcon from "@heroicons/vue/24/outline/ArrowPathIcon";
import {defineComponent} from "vue";

export default defineComponent({
    name: "BaseButton",
    components: {ArrowPathIcon},
    props: {
        outlined: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
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
                    return this.outlined ?
                        'border text-purple-800 border-purple-600 bg-white hover:bg-purple-50' :
                        'bg-purple-600 hover:bg-purple-500 text-white'
                case 'danger':
                    return this.outlined ?
                        'border text-red-800 border-red-600 bg-white hover:bg-red-50' :
                        'bg-red-600 hover:bg-red-500 text-white';
                case 'success':
                    return this.outlined ?
                        'border text-green-800 border-green-600 bg-white hover:bg-green-50' :
                        'bg-green-600 hover:bg-green-500 text-white';
                case 'warning':
                    return this.outlined ?
                        'border text-yellow-800 border-yellow-600 bg-white hover:bg-yellow-50' :
                        'bg-yellow-600 hover:bg-yellow-500 text-white';
                default:
                    return this.outlined ?
                        'border text-purple-800 border-purple-600 bg-white hover:bg-purple-50' :
                        'bg-purple-600 hover:bg-purple-500 text-white'
            }
        },
    },
});
</script>
