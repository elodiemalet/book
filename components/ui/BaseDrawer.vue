<template>
    <TransitionRoot
        as="template"
        :show="open">
        <DialogComponent
            class="relative z-[50] "
            @close="close">
            <div class="fixed inset-0"/>
            <div class="fixed inset-0 overflow-hidden">
                <div class="absolute inset-0 overflow-hidden">
                    <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                        <TransitionChild
                            as="template"
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enter-from="translate-x-full"
                            enter-to="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leave-from="translate-x-0"
                            leave-to="translate-x-full">
                            <DialogPanel class="pointer-events-auto w-screen max-w-2xl">
                                <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                    <div class="flex-1">
                                        <!-- Header -->
                                        <div class="bg-gray-50 px-4 py-6 sm:px-6">
                                            <div class="flex items-start justify-between space-x-3">
                                                <div class="space-y-1">
                                                    <DialogTitle class="text-base font-semibold text-gray-900">
                                                        <slot name="title"/>
                                                    </DialogTitle>
                                                    <p class="text-sm text-gray-500">
                                                        <slot name="description"/>
                                                    </p>
                                                </div>
                                                <div
                                                    class="flex h-7 items-center cursor-pointer"
                                                    @click="close">
                                                    <div class="relative text-gray-400 hover:text-gray-500">
                                                        <span class="absolute -inset-2.5"/>
                                                        <span class="sr-only">Close panel</span>
                                                        <XMarkIcon
                                                            class="size-6"
                                                            aria-hidden="true"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Divider container -->
                                        <div
                                            class="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 px-4 sm:px-6 sm:py-5">
                                            <slot/>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </div>
        </DialogComponent>
    </TransitionRoot>
</template>

<script lang="ts">

import {Dialog as DialogComponent, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue';
import {XMarkIcon} from "@heroicons/vue/24/outline";

export default {
    name: "BaseDrawer",
    components: {DialogTitle, DialogComponent, DialogPanel, TransitionChild, TransitionRoot, XMarkIcon},
    props: {
        open: {
            type: Boolean,
            default: false,
        }
    },
    emits: ['update:open', 'close'],
    methods: {
        close() {
            this.$emit('update:open', false);
            this.$emit('close');
        }
    }
};

</script>
