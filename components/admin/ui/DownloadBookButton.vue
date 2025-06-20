<template>
    <button
        type="button"
        class="no-print mt-2 text-white bg-gradient-to-br from-purple-600 to-cyan-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg px-3 py-2 text-xs text-left me-2 mb-2"
        @click="downloadBook">
        Télécharger le livre
    </button>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "DownloadBookButton",
    setup() {
        const toast = useToast();
        return {
            toast
        };
    },

    methods: {
        async downloadBook() {
            try {
                const {data, error} = await useFetch('/api/generate-pdf', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: {
                        endpoint: 'book',
                        token: 'mon-token-perso',
                    },
                    responseType: 'blob',
                });

                if (error.value) {
                    this.toast.add({
                        id: 'error',
                        color: 'red',
                        icon: 'i-material-symbols-file-download-off',
                        title: 'Erreur lors de la génération du PDF',
                    });
                    return;
                }

                try {
                    const blob = data.value;

                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'Book.pdf');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                    this.toast.add({
                        id: 'downloaded',
                        icon: 'i-material-symbols-download',
                        title: 'Le livre a été téléchargé avec succès',
                    });
                } catch {
                    this.toast.add({
                        id: 'error',
                        color: 'red',
                        icon: 'i-material-symbols-file-download-off',
                        title: 'Erreur lors de la génération du PDF',
                    });
                }

            } catch (error) {
                console.error('Erreur lors de la génération du PDF:', error);
            }

        }
    }
});
</script>