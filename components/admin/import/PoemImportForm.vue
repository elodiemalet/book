<template>
    <div>
        <h3 class="text-base/7 font-semibold text-gray-900">Import</h3>
        <p class="mt-1 text-sm/6 text-gray-600">Importez des fichiers JSON, CSV, texte, HTML, Markdown, ODT ou
            MS Word contenant les textes à importer</p>
    </div>
    <form class="mx-auto flex flex-col gap-4 justify-center">
        <div class="space-y-12">

            <BaseDropzone
                v-model:files="files"
                :max-size="1024 * 50"
                :max-files="5"
                :accept="['application/json', 'text/csv', 'text/plain', 'text/html', 'text/markdown', 'application/vnd.oasis.opendocument.text', 'application/msword']"
            />
            <div class="mt-2 flex items-center justify-end gap-x-6">
                <CancelButton
                    @click="cancel"
                >
                    Annuler
                </CancelButton>
                <BaseButton
                    :loading="loading"
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
        <div class="border-b border-gray-200 pb-5">
            <h3 class="text-base font-semibold text-gray-900">Résultat de l'import</h3>
        </div>

        <CardTable
            :columns="[
                { name: 'Type', key: 'type' },
                { name: 'Success', key: 'success' },
                { name: 'Error', key: 'error' },
                { name: 'Total', key: 'total' },
            ]"
            :rows="resultImportedDatas"
        />
    </div>

</template>

<script lang="ts">

import BaseButton from "~/components/ui/buttons/BaseButton.vue";
import BaseDropzone from "~/components/ui/BaseDropzone.vue";
import type {FileEntity} from "~/entities/FileEntity";
import CardTable from "~/components/ui/CardTable.vue";
import CancelButton from "~/components/ui/buttons/CancelRoundButton.vue";

export default defineComponent({
    name: "PoemImportForm",
    components: {CancelButton, CardTable, BaseDropzone, BaseButton},
    setup() {
        const toast = useToast();
        return {
            toast
        };
    },
    data() {
        return {
            file: null,
            files: [],
            resultImportedDatas: [],
            loading: false,
        };
    },
    methods: {
        async importPoem() {
            this.loading = true;
            this.resultImportedDatas = [];
            if (this.files.length > 0) {
                const formData = new FormData();

                for (const file of this.files as FileEntity[]) {
                    formData.append('file' + file.id, file.file);
                }

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
                }

                const result = {...data.value?.result};
                Object.entries(result).forEach(([, item]) => {
                    Object.entries(item).forEach(([type, data]) => {
                        this.resultImportedDatas.push({
                            type: type,
                            success: data.success,
                            error: data.error,
                            total: data.total,
                        });
                    })
                })

                this.files = [];
                this.loading = false;

                this.toast.add({
                    id: 'success',
                    title: 'Import terminé',
                });
            }
        },
        cancel() {
            this.files = [];
        },
    }
});

</script>
