<template>
    <NuxtLayout name="admin-page">
        <template #title>Ajouter un connecteur API</template>
        <template #actions>
            <AdminNavTabs
                :tabs="tabs"
                class="mb-12"
            />
        </template>
        <ApiImportForm/>
    </NuxtLayout>
</template>

<script lang="ts">
import ApiImportForm from "~/components/admin/import/ApiImportForm.vue";
import AdminNavTabs from "~/components/admin/ui/AdminNavTabs.vue";

export default {
    components: {ApiImportForm, AdminNavTabs},
    data() {
        return {
            tabs: [
                {name: 'Télécharger des fichiers ', route: '/admin/import', current: false},
                {name: 'Connecter une api', route: '/admin/import/api', current: true},
            ],
        };
    },
};
</script>