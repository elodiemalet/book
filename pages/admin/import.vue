<template>
    <NuxtLayout name="admin-page">
        <template #title>Importer du contenu</template>
        <PoemImportForm/>
    </NuxtLayout>
</template>

<script setup lang="ts">
import PoemImportForm from "~/components/admin/import/PoemImportForm.vue";
</script>