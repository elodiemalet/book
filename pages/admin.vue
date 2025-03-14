<template>
    <NuxtPage/>
</template>

<script setup lang="ts">

definePageMeta({
    middleware: "authenticated",
    layout: 'admin',
});

</script>