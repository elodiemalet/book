<template>
    <button
        type="button"
        class="rounded-md  px-3 py-2 font-semibold shadow-xs disabled:cursor-not-allowed"
        :class="
            [
                outlined ? 'border text-purple-800 border-purple-600 bg-white hover:bg-purple-50' : 'bg-purple-600 hover:bg-purple-500 text-white',
                loading ? 'cursor-not-allowed bg-opacity-75' : ''
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
                <slot/>
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
        }
    },
    emits: ['click']
});
</script>
