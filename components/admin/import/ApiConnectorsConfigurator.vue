<template>
    <ul
        role="list"
        class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
        <li
            v-for="connector in connectors"
            :key="connector.id"
            class="overflow-hidden rounded-xl border border-gray-200">
            <div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                <img
                    :src="connector.imageUrl"
                    :alt="connector.name"
                    class="size-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10">
                <div class="text-sm/6 font-medium text-gray-900">
                    {{ connector.name }}
                    <p class="text-xs text-gray-500">{{ connector.description }}</p>
                </div>
                <HMenu
                    as="div"
                    class="relative ml-auto">
                    <MenuButton class="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                        <span class="sr-only">Open options</span>
                        <EllipsisHorizontalIcon
                            class="size-5"
                            aria-hidden="true"/>
                    </MenuButton>
                    <transition
                        enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95"
                        enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">
                        <MenuItems
                            class="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            <MenuItem v-slot="{ active }">
                                <a
                                    href="#"
                                    :class="[active ? 'bg-gray-50 outline-none' : '', 'block px-3 py-1 text-sm/6 text-gray-900']"
                                >View<span class="sr-only">, {{ connector.name }}</span></a
                                >
                            </MenuItem>
                            <MenuItem v-slot="{ active }">
                                <a
                                    href="#"
                                    :class="[active ? 'bg-gray-50 outline-none' : '', 'block px-3 py-1 text-sm/6 text-gray-900']"
                                >Edit<span class="sr-only">, {{ connector.name }}</span></a
                                >
                            </MenuItem>
                        </MenuItems>
                    </transition>
                </HMenu>
            </div>
            <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm/6">
                <div class="flex justify-between gap-x-4 py-3">
                    <dt class="text-gray-500">Last invoice</dt>
                    <dd class="text-gray-700">
                        <time :datetime="connector.lastImport.dateTime">{{ connector.lastImport.date }}</time>
                    </dd>
                </div>
                <div class="flex justify-between gap-x-4 py-3">
                    <dt class="text-gray-500">Amount</dt>
                    <dd class="flex items-start gap-x-2">
                        <div class="font-medium text-gray-900">{{ connector.lastImport.amount }}</div>
                        <div
                            :class="[statuses[connector.lastImport.status], 'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset']">
                            {{ connector.lastImport.status }}
                        </div>
                    </dd>
                </div>
            </dl>
        </li>
    </ul>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Menu as HMenu, MenuButton, MenuItem, MenuItems} from "@headlessui/vue";
import EllipsisHorizontalIcon from "@heroicons/vue/24/outline/EllipsisHorizontalIcon";

export default defineComponent({
    name: "ApiConnectorsConfigurator",
    components: {HMenu, MenuItem, MenuItems, MenuButton, EllipsisHorizontalIcon},
    data() {
        return {
            connectors: [
                {
                    id: '1',
                    name: 'Google Drive',
                    description: 'Importer des fichiers Google Drive',
                    imageUrl: '/images/connectors-logos/google-drive.png',
                    lastImport: {
                        date: '2023-01-01',
                        dateTime: '2023-01-01T00:00:00.000Z',
                        amount: '1000',
                        status: 'success',
                    },
                },
                {
                    id: '2',
                    name: 'Contentful',
                    description: 'Importer des contenus Contentful',
                    imageUrl: '/images/connectors-logos/contentful.svg',
                    lastImport: {
                        date: '2023-01-01',
                        dateTime: '2023-01-01T00:00:00.000Z',
                        amount: '1000',
                        status: 'success',
                    },
                },
                {
                    id: '3',
                    name: 'WordPress',
                    description: 'Importer des contenus WordPress',
                    imageUrl: '/images/connectors-logos/wordpress.png',
                    lastImport: {
                        date: '2023-01-01',
                        dateTime: '2023-01-01T00:00:00.000Z',
                        amount: '1000',
                        status: 'error',
                    },
                },
            ],
            statuses: {
                success: 'bg-green-100 text-green-800',
                error: 'bg-red-100 text-red-800',
            },
        };
    },
})
</script>