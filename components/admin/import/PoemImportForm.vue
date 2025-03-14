<template>
    <form class="mx-auto flex flex-col gap-4 justify-center">
        <div class="space-y-12">
            <div>
                <h3 class="text-base/7 font-semibold text-gray-900">Import</h3>
                <p class="mt-1 text-sm/6 text-gray-600">Importez un fichier JSON contenant les textes à importer</p>
            </div>
            <base-dropzone
                label="Fichier JSON"
                :max-size="1024 * 1024 * 10"
                :max-files="2"
                :accept="['application/json']"
                v-model:files="files"
            />
            <div class="mt-2 flex items-center justify-end gap-x-6">
                <CancelButton
                    @click="cancel"
                >
                    Annuler
                </CancelButton>
                <BaseButton
                    @click="importPoem"
                >
                    Importer
                </BaseButton>
            </div>
        </div>
    </form>
    <div
        v-if="resultImportedDatas.length > 0"
        class="rounded-lg px-4 sm:px-6 lg:px-8 shadow-sm bg-gray-100 ring-1 ring-gray-950/10 py-10 mt-8 ">
        <template>
            <div class="border-b border-gray-200 pb-5">
                <h3 class="text-base font-semibold text-gray-900">Résultat de l'import</h3>
            </div>
        </template>

        <CardTable
            :columns="[
                { name: 'Nom du fichier', key: 'name' },
                { name: 'Type', key: 'type' },
                { name: 'Importé(s)', key: 'success' },
                { name: 'Erreur(s)', key: 'error' },
                { name: 'Total', key: 'total' },
            ]"
            :rows="resultImportedDatas"
        />
    </div>

</template>

<script lang="ts">

import BaseButton from "~/components/Ui/BaseButton.vue";
import BaseBanner from "~/components/Ui/BaseBanner.vue";
import BaseDropzone from "~/components/Ui/BaseDropzone.vue";
import type {FileEntity} from "~/entities/FileEntity";
import CardTable from "~/components/Ui/CardTable.vue";
import CancelButton from "~/components/Ui/CancelButton.vue";

export default defineComponent({
    name: "PoemImportForm",
    components: {CancelButton, CardTable, BaseDropzone, BaseBanner, BaseButton},
    data() {
        return {
            file: null,
            files: [],
            resultImportedDatas: []
        }
    },
    setup() {
        const toast = useToast()
        return {
            toast
        }
    },
    methods: {
        async importPoem() {
            this.resultImportedDatas = [];
            if (this.files.length > 0) {
                for (const file of this.files as FileEntity[]) {
                    const formData = new FormData();
                    formData.append('file', file.file);

                    const {data, error} = await useFetch('/api/import',
                        {
                            method: 'POST',
                            body: formData,
                        });

                    if (error.value) {
                        this.toast.add({
                            id: 'error',
                            icon: 'i-material-symbols-file-download-off',
                            title: 'Erreur lors de l\'importation du fichier',
                            color: 'red',

                        });
                        continue
                    }

                    const result = {...data.value}
                    for (const [res, item] of Object.entries(result)) {
                        for (const [type, data] of Object.entries(item)) {
                            this.resultImportedDatas.push({
                                name: file.name,
                                type: type,
                                success: data.success,
                                error: data.error,
                                total: data.total,
                            })
                        }
                    }
                }

                this.files = [];

                this.toast.add({
                    id: 'success',
                    icon: 'i-material-symbols-file-download-off',
                    title: 'Fichier importé avec succès',
                });
            }
        },
        cancel() {
            this.files = [];
        },
    }
})


</script>