<template>
    <nav class="bg-gray-800">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div class="relative flex h-16 items-center justify-between">
                <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div class="hidden sm:ml-6 sm:block">
                        <div class="flex space-x-4">
                            <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                            <NuxtLink
                                active-class="active-link"
                                class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                to="/">Accueil
                            </NuxtLink>
                            <NuxtLink
                                active-class="active-link"
                                class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                to="/poem">Liste des poèmes
                            </NuxtLink>
                            <NuxtLink
                                active-class="active-link"
                                class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                to="/book">Livre
                            </NuxtLink>

                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    class="no-print mt-2 text-white bg-gradient-to-br from-purple-600 to-cyan-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg px-3 py-2 text-xs text-left me-2 mb-2"
                    @click="downloadBook">
                    Télécharger le livre
                </button>
                <!-- Profile dropdown -->
                <MenuComponent
                    as="div"
                    class="relative ml-3">
                    <div>
                        <MenuButton
                            class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span class="absolute -inset-1.5"/>
                            <span class="sr-only">Open user menu</span>
                            <img
                                class="size-8 rounded-full"
                                :src="user.imageUrl"
                                alt="">
                        </MenuButton>
                    </div>
                    <Transition
                        enter-active-class="transition ease-out duration-200"
                        enter-from-class="transform opacity-0 scale-95"
                        enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">
                        <MenuItems
                            class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                            <MenuItem
                                v-for="item in userNavigation"
                                :key="item.name"
                                v-slot="{ active }">
                                <a
                                    :href="item.href"
                                    :class="[active ? 'bg-gray-100 outline-none' : '', 'block px-4 py-2 text-sm text-gray-700']">{{
                                    item.name
                                }}</a>
                            </MenuItem>
                        </MenuItems>
                    </Transition>
                </MenuComponent>
            </div>
        </div>

        <!-- Mobile menu, show/hide based on menu state. -->
        <div
            id="mobile-menu"
            class="sm:hidden">
            <div class="space-y-1 px-2 pb-3 pt-2">
                <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                <NuxtLink
                    class="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                    to="/">Accueil
                </NuxtLink>
                <NuxtLink
                    class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    to="/poem">Liste des poèmes
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

import {Menu as MenuComponent, MenuButton, MenuItem, MenuItems} from "@headlessui/vue";

export default defineComponent({
    components: {MenuComponent, MenuItem, MenuItems, MenuButton},
    setup() {
        const toast = useToast();
        return {
            toast
        };
    },
    data() {
        return {
            user: {
                name: 'Admin',
                email: 'admin@example.com',
                imageUrl:
                    '/images/avatars/author.png',
            },
            userNavigation: [
                {name: 'Your profile', href: 'admin'},
                {name: 'Se déconnecter', href: 'logout'},
            ],
        };
    },
    methods: {
        async downloadBook() {
            try {
                const {data, error} = await useFetch('/api/generate-pdf', {
                    method: 'POST',
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

<style scoped lang="scss">

.active-link {
    @apply bg-gray-900 text-white;
}

</style>
