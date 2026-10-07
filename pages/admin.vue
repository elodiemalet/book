<template>
    <NuxtPage/>
</template>

<script setup lang="ts">

definePageMeta({
    middleware: "authenticated",
    layout: 'admin',
});

// Un seul titre pour toute l'admin : le nom de l'application (voir public/site.webmanifest)
useHead({title: 'Colophon'});

</script>
