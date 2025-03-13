<template>
    <form class="max-w-xl mx-auto flex flex-col  justify-center">
        <label class="block mb-2 font-medium text-gray-900 dark:text-white" for="file_input">Importer un fichier</label>
        <input
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input" type="file"
            @change="file = $event.target?.files[0]"
        >

        <div class="flex flex-col items-center justify-center">
            <BaseButton
                @click="importPoem"
            >
                Import
            </BaseButton>
        </div>
    </form>
    <div v-if="importedDatas">
        <BaseBanner
            title="Résultat de l'import"
        >
            <div v-for="(importData, i) in importedDatas" :key="i">
                <div v-for="(item, title) in importData" :key="j">
                    <p>{{ getTitle(title) }}</p>
                    <p>
                        Importé(s) avec succè(s): {{ item.success }} | Erreur(s): {{ item.error }} | Total:
                        {{ item.total }}
                    </p>
                </div>
            </div>
        </BaseBanner>
    </div>

</template>

<script lang="ts">

import BaseButton from "~/components/Ui/BaseButton.vue";
import BaseBanner from "~/components/Ui/BaseBanner.vue";

export default defineComponent({
    name: "PoemImportForm",
    components: {BaseBanner, BaseButton},
    data() {
        return {
            file: null,
            resultImport: null,
        }
    },
    setup() {
        const toast = useToast()
        return {
            toast
        }
    },
    computed: {
        importedDatas() {
            return this.resultImport
        }
    },
    methods: {
        async importPoem() {
            if (this.file) {
                const formData = new FormData();
                formData.append('file', this.file);

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
                    return
                }

                console.log(data)

                this.resultImport = data;

                this.toast.add({
                    id: 'success',
                    icon: 'i-material-symbols-file-download-off',
                    title: 'Fichier importé avec succès',
                });
            }
        },
        getTitle(title: string) {
            return title.charAt(0).toUpperCase() + title.slice(1);
        }
    }
})


</script>