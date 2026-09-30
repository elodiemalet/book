<template>
    <NuxtLayout name="admin-page">
        <template #title>Importer du contenu</template>
        <template #actions>
            <AdminNavTabs :tabs="tabs"/>
        </template>
        <PoemImportForm/>
    </NuxtLayout>
</template>

<script lang="ts">
import PoemImportForm from "~/components/admin/import/PoemImportForm.vue";
import AdminNavTabs from "~/components/admin/ui/AdminNavTabs.vue";

export default {
    components: {PoemImportForm, AdminNavTabs},
    data() {
        return {
            tabs: [
                {name: 'Télécharger des fichiers', route: '/admin/import', current: true},
                {name: 'Connecter une API', route: '/admin/import/api', current: false},
            ],
        };
    },
};
</script>
