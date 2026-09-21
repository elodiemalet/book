<template>
    <NuxtLayout name="admin-page">
        <template #title>Configuration du livre</template>
        <template #actions>
            <AdminNavTabs
                :tabs="tabs"
                class="mb-12"
            />
        </template>

        <div class="max-w-2xl space-y-8">
            <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Métadonnées</h3>
                <div class="space-y-4">
                    <UFormGroup label="Titre du recueil">
                        <UInput v-model="form.title" />
                    </UFormGroup>
                    <UFormGroup label="Auteur">
                        <UInput v-model="form.author" />
                    </UFormGroup>
                    <UFormGroup label="Années">
                        <UInput
                            v-model="form.years"
                            placeholder="2019 - 2024" />
                    </UFormGroup>
                    <UFormGroup label="Texte de dédicace">
                        <UTextarea
                            v-model="form.dedicationText"
                            :rows="6" />
                    </UFormGroup>
                    <UFormGroup label="Auteur de la dédicace">
                        <UInput v-model="form.dedicationAuthor" />
                    </UFormGroup>
                    <UFormGroup label="Texte de préface">
                        <UTextarea
                            v-model="form.prefaceText"
                            :rows="6" />
                    </UFormGroup>
                </div>
            </div>

            <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Format et mise en page</h3>
                <div class="space-y-4">
                    <UFormGroup label="Format de page">
                        <USelect
                            v-model="form.pageFormat"
                            :options="pageFormats"
                            value-attribute="value"
                            option-attribute="label"
                        />
                    </UFormGroup>
                    <UFormGroup label="Lignes max par page">
                        <UInput
                            v-model.number="form.maxLines"
                            type="number" />
                    </UFormGroup>
                    <UFormGroup label="Lignes max (première page du poème)">
                        <UInput
                            v-model.number="form.maxLinesFirstPage"
                            type="number" />
                    </UFormGroup>
                    <UFormGroup label="Numéro de page de départ">
                        <UInput
                            v-model.number="form.pageStart"
                            type="number" />
                    </UFormGroup>
                    <UCheckbox
                        v-model="form.showSignature"
                        label="Afficher l'auteur et la date sous chaque texte"
                        help="À décocher pour un livre classique d'un seul auteur."
                    />
                </div>
            </div>

            <UButton
                label="Enregistrer"
                color="primary"
                :loading="saving"
                @click="save"
            />
        </div>
    </NuxtLayout>
</template>

<script lang="ts">
import AdminNavTabs from "~/components/admin/ui/AdminNavTabs.vue";

export default {
    components: {AdminNavTabs},
    data() {
        const toast = useToast();
        return {
            toast,
            saving: false,
            tabs: [
                {name: 'Mon livre', route: '/admin/book', current: false},
                {name: 'Configuration', route: '/admin/book/settings', current: true},
            ],
            form: {
                title: '',
                author: '',
                years: '',
                dedicationText: '',
                dedicationAuthor: '',
                prefaceText: '',
                pageFormat: 'a4',
                maxLines: 38,
                maxLinesFirstPage: 32,
                pageStart: 6,
                showSignature: true,
            },
            pageFormats: [
                {label: 'Poche (108 × 175 mm)', value: 'poche'},
                {label: 'Digest (140 × 216 mm)', value: 'digest'},
                {label: 'A5 (148 × 210 mm)', value: 'a5'},
                {label: 'Royal (156 × 234 mm)', value: 'royal'},
                {label: 'Roman (152 × 229 mm)', value: 'roman'},
                {label: 'BD (168 × 260 mm)', value: 'bd'},
                {label: 'Exécutif (178 × 254 mm)', value: 'executif'},
                {label: 'Crown Quarto (189 × 246 mm)', value: 'crown-quarto'},
                {label: 'Petit Carré (191 × 191 mm)', value: 'petit-carre'},
                {label: 'A4 (210 × 297 mm)', value: 'a4'},
                {label: 'Carré (216 × 216 mm)', value: 'carre'},
                {label: 'Lettre US (216 × 279 mm)', value: 'lettre-us'},
                {label: 'Petit Paysage (229 × 178 mm)', value: 'petit-paysage'},
                {label: 'Lettre US Paysage (279 × 216 mm)', value: 'lettre-us-paysage'},
                {label: 'A4 Paysage (297 × 210 mm)', value: 'a4-paysage'},
                {label: 'Calendrier (279 × 216 mm)', value: 'calendrier'},
            ],
        };
    },
    async mounted() {
        await this.fetchConfig();
    },
    methods: {
        async fetchConfig() {
            const data = await $fetch('/api/book-config');
            if (data) {
                this.form.title = data.title || '';
                this.form.author = data.author || '';
                this.form.years = data.years || '';
                this.form.dedicationText = data.dedicationText || '';
                this.form.dedicationAuthor = data.dedicationAuthor || '';
                this.form.prefaceText = data.prefaceText || '';
                this.form.pageFormat = data.pageFormat || 'a4';
                this.form.maxLines = data.maxLines || 38;
                this.form.maxLinesFirstPage = data.maxLinesFirstPage || 32;
                this.form.pageStart = data.pageStart || 6;
                this.form.showSignature = data.showSignature ?? true;
            }
        },
        async save() {
            this.saving = true;
            try {
                await $fetch('/api/book-config', {
                    method: 'PUT',
                    body: this.form,
                });
                this.toast.add({
                    id: 'config-saved',
                    icon: 'i-heroicons-check-circle',
                    title: 'Configuration enregistrée avec succès',
                });
            } catch {
                this.toast.add({
                    id: 'config-error',
                    icon: 'i-heroicons-x-circle',
                    title: 'Erreur lors de l\'enregistrement',
                    color: 'red',
                });
            } finally {
                this.saving = false;
            }
        },
    },
};
</script>
