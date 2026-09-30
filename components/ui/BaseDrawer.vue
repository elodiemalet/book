<template>
    <TransitionRoot
        as="template"
        :show="open">
        <DialogComponent
            class="relative z-50 "
            @close="close">
            <div
                class="fixed inset-0 bg-black/50"
                aria-hidden="true"/>
            <div class="fixed inset-0 overflow-hidden">
                <div class="absolute inset-0 overflow-hidden">
                    <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                        <TransitionChild
                            as="template"
                            enter="transform transition ease-atelier duration-300"
                            enter-from="translate-x-full"
                            enter-to="translate-x-0"
                            leave="transform transition ease-in duration-200"
                            leave-from="translate-x-0"
                            leave-to="translate-x-full">
                            <DialogPanel class="pointer-events-auto w-screen max-w-xl">
                                <div class="flex h-full flex-col overflow-y-auto border-l border-atelier-line bg-atelier-panel text-atelier-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]">
                                    <div class="flex-1">
                                        <!-- Header -->
                                        <div class="border-b border-atelier-line px-5 py-6 sm:px-7">
                                            <div class="flex items-start justify-between space-x-3">
                                                <div class="space-y-1">
                                                    <DialogTitle class="font-fraunces text-2xl font-normal">
                                                        <slot name="title"/>
                                                    </DialogTitle>
                                                    <p class="text-sm text-atelier-muted">
                                                        <slot name="description"/>
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    class="inline-flex size-9 items-center justify-center rounded-md text-atelier-muted transition-colors duration-150 hover:bg-atelier-hover hover:text-atelier-ink focus-visible:outline-2 focus-visible:outline-lilas"
                                                    aria-label="Fermer"
                                                    @click="close">
                                                    <XMarkIcon
                                                        class="size-5"
                                                        aria-hidden="true"/>
                                                </button>
                                            </div>
                                        </div>
                                        <!-- Divider container -->
                                        <div
                                            class="px-5 py-6 sm:px-7">
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
