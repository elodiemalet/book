<template>
    <NuxtLayout name="admin-page">
        <template #title>Importer du contenu</template>
        <template #actions>
            <AdminNavTabs :tabs="tabs"/>
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
                {name: 'Télécharger des fichiers', route: '/admin/import', current: false},
                {name: 'Connecter une API', route: '/admin/import/api', current: true},
            ],
        };
    },
};
</script>