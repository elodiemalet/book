<template>
    <div
        class="bg-cyan-100 border-t border-b border-cyan-500 text-cyan-700 px-4 py-3"
        role="alert">
        <p class="font-bold">{{ title }}</p>
        <p class="text-sm">
            <slot>{{ message }}</slot>
        </p>
    </div>
</template>

<script lang="ts">

export default {
    name: "BaseBanner",
    props: {
        title: {
            type: String,
            default: '',
        },
        message: {
            type: String,
            default: '',
        }
    }
};
</script>
