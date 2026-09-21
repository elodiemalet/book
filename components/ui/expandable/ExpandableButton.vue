<template>
    <button
        type="button"
        class="flex items-center text-base font-medium tracking-tight text-slate-900 hover:text-slate-700"
    >
        <slot/>
        <ArrowDownIcon class="ml-2 h-6 w-6"/>
    </button>
</template>

<script lang="ts">
import ArrowDownIcon from "@heroicons/vue/24/outline/ArrowDownIcon";

export default {
    components: {ArrowDownIcon}

};
</script>
