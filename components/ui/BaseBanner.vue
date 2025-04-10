<template>
    <div class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
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
        },
        message: {
            type: String,
        }
    }
}
</script>