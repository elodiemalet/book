<template>
    <nav class="bg-gray-800">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div class="relative flex h-16 items-center justify-between">
                <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div class="hidden sm:ml-6 sm:block">
                        <div class="flex space-x-4">
                            <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                            <NuxtLink
                                class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                                to="/">Accueil
                            </NuxtLink>
                            <NuxtLink
                                class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                to="/poem/list">Liste des poèmes
                            </NuxtLink>
                            <NuxtLink
                                class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                to="/book">Livre
                            </NuxtLink>

                        </div>
                    </div>
                </div>
                <button type="button"
                        class="no-print mt-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-3 py-2 text-xs text-center me-2 mb-2"
                        @click="downloadBook">
                    Télécharger le livre
                </button>
            </div>
        </div>

        <!-- Mobile menu, show/hide based on menu state. -->
        <div class="sm:hidden" id="mobile-menu">
            <div class="space-y-1 px-2 pb-3 pt-2">
                <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                <NuxtLink
                    class="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                    to="/">Accueil
                </NuxtLink>
                <NuxtLink
                    class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    to="/poem/list">Liste des poèmes
                </NuxtLink>
                <NuxtLink
                    class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    to="/book">Livre
                </NuxtLink>

            </div>
        </div>
    </nav>
</template>

<script lang="ts">

export default defineComponent({
    setup() {
        const toast = useToast()
        return {
            toast
        }
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
                        icon: 'i-material-symbols-file-download-off',
                        title: 'Erreur lors de la génération du PDF',
                    });
                    return
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
                } catch (error) {
                    this.toast.add({
                        id: 'error',
                        icon: 'i-material-symbols-file-download-off',
                        title: 'Erreur lors de la génération du PDF',
                    });
                }


            } catch (error) {
                console.error('Erreur lors de la génération du PDF:', error);
            }

        }
    }
})

</script>