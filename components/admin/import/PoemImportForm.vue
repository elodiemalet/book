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
                :max-files="20"
                :accept="['application/json', 'text/csv', 'text/plain', 'text/html', 'text/markdown', 'application/vnd.oasis.opendocument.text', 'application/msword']"
            />
            <div class="mt-2 flex items-center justify-end gap-x-6">
                <CancelButton
                    @click="cancel"
                >
                    Annuler
                </CancelButton>
                <BaseButton
                    :loading="submitting"
                    :disabled="files.length === 0 || submitting"
                    @click="startQueue"
                >
                    Importer
                </BaseButton>
            </div>
        </div>
    </form>

    <!-- Queue display -->
    <div
        v-if="queue.length > 0"
        class="mt-8 space-y-3"
    >
        <div class="border-b border-gray-200 pb-3 flex items-center justify-between">
            <h3 class="text-base font-semibold text-gray-900">File d'import</h3>
            <span class="text-sm text-gray-500">
                {{ completedCount }}/{{ queue.length }} traité{{ completedCount > 1 ? 's' : '' }}
            </span>
        </div>

        <!-- Progress bar -->
        <div class="w-full bg-gray-200 rounded-full h-2">
            <div
                class="h-2 rounded-full transition-all duration-300"
                :class="hasErrors ? 'bg-amber-500' : 'bg-indigo-600'"
                :style="{ width: progressPercent + '%' }"
            />
        </div>

        <ul class="divide-y divide-gray-100">
            <li
                v-for="item in queue"
                :key="item.id"
                class="flex items-center justify-between py-3 px-4 rounded-md mb-2"
                :class="{
                    'bg-white': item.status === 'pending',
                    'bg-indigo-50': item.status === 'processing',
                    'bg-green-50': item.status === 'done',
                    'bg-red-50': item.status === 'error',
                }"
            >
                <div class="flex items-center gap-3 min-w-0">
                    <!-- Status icon -->
                    <div class="shrink-0">
                        <ClockIcon
                            v-if="item.status === 'pending'"
                            class="size-5 text-gray-400"
                        />
                        <ArrowPathIcon
                            v-else-if="item.status === 'processing'"
                            class="size-5 text-indigo-600 animate-spin"
                        />
                        <CheckCircleIcon
                            v-else-if="item.status === 'done'"
                            class="size-5 text-green-600"
                        />
                        <ExclamationCircleIcon
                            v-else-if="item.status === 'error'"
                            class="size-5 text-red-600"
                        />
                    </div>

                    <div class="min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ item.fileName }}</p>
                        <p
                            v-if="item.status === 'done' && item.result"
                            class="text-xs text-green-700"
                        >
                            <span
                                v-if="item.result.posts.error > 0"
                                class="text-red-600"
                            >
                                · {{ item.result.posts.error }} erreur{{ item.result.posts.error > 1 ? 's' : '' }}
                            </span>
                        </p>
                        <p
                            v-else-if="item.status === 'error'"
                            class="text-xs text-red-600"
                        >
                            {{ item.errorMessage || 'Erreur lors de l\'import' }}
                        </p>
                        <p
                            v-else-if="item.status === 'processing'"
                            class="text-xs text-indigo-600"
                        >
                            Import en cours…
                        </p>
                    </div>
                </div>

                <div class="shrink-0 ml-4">
                    <span
                        class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                        :class="{
                            'bg-gray-100 text-gray-600': item.status === 'pending',
                            'bg-indigo-100 text-indigo-700': item.status === 'processing',
                            'bg-green-100 text-green-700': item.status === 'done',
                            'bg-red-100 text-red-700': item.status === 'error',
                        }"
                    >
                        {{ statusLabel(item.status) }}
                    </span>
                </div>
            </li>
        </ul>

        <!-- Summary -->
        <div
            v-if="allDone"
            class="rounded-lg px-4 py-4 mt-2"
            :class="hasErrors
                ? 'bg-amber-50 ring-1 ring-amber-200'
                : 'bg-green-50 ring-1 ring-green-200'"
        >
            <p
                class="text-sm font-medium"
                :class="hasErrors ? 'text-amber-800' : 'text-green-800'"
            >
                Import terminé — {{ totalSuccess }} contenu{{ totalSuccess > 1 ? 's' : '' }}
                importé{{ totalSuccess > 1 ? 's' : '' }}
                <span v-if="totalErrors > 0">, {{ totalErrors }} erreur{{ totalErrors > 1 ? 's' : '' }}</span>
            </p>
        </div>
    </div>

</template>

<script lang="ts">

import BaseButton from "~/components/ui/buttons/BaseButton.vue";
import BaseDropzone from "~/components/ui/BaseDropzone.vue";
import type {FileEntity} from "~/entities/FileEntity";
import CancelButton from "~/components/ui/buttons/CancelRoundButton.vue";
import {ClockIcon, CheckCircleIcon, ExclamationCircleIcon, ArrowPathIcon} from "@heroicons/vue/24/outline";
import type {ImportJob} from "~/server/services/importQueue";

export default defineComponent({
    name: "PoemImportForm",
    components: {
        CancelButton,
        BaseDropzone,
        BaseButton,
        ClockIcon,
        CheckCircleIcon,
        ExclamationCircleIcon,
        ArrowPathIcon
    },
    setup() {
        const toast = useToast();
        return {
            toast
        };
    },
    data() {
        return {
            files: [] as FileEntity[],
            queue: [] as ImportJob[],
            submitting: false,
            pollingTimer: null as ReturnType<typeof setInterval> | null,
            toastShown: false,
        };
    },
    computed: {
        completedCount(): number {
            return this.queue.filter(i => i.status === 'done' || i.status === 'error').length;
        },
        progressPercent(): number {
            if (this.queue.length === 0) return 0;
            return Math.round((this.completedCount / this.queue.length) * 100);
        },
        hasErrors(): boolean {
            return this.queue.some(i => i.status === 'error');
        },
        allDone(): boolean {
            return this.queue.length > 0 && this.completedCount === this.queue.length;
        },
        totalSuccess(): number {
            return this.queue.reduce((sum, i) => sum + (i.result?.posts.success ?? 0), 0);
        },
        totalErrors(): number {
            return this.queue.reduce((sum, i) => sum + (i.result?.posts.error ?? 0), 0);
        },
    },
    async mounted() {
        await this.fetchJobs();
        if (!this.allDone && this.queue.length > 0) {
            this.startPolling();
        }
    },
    beforeUnmount() {
        this.stopPolling();
    },
    methods: {
        statusLabel(status: string): string {
            const labels: Record<string, string> = {
                pending: 'En attente',
                processing: 'En cours',
                done: 'Terminé',
                error: 'Erreur',
            };
            return labels[status] || status;
        },
        async startQueue() {
            if (this.files.length === 0) return;

            this.submitting = true;
            this.toastShown = false;

            const formData = new FormData();
            for (const file of this.files) {
                formData.append('file' + file.id, file.file);
            }

            this.files = [];

            try {
                const response = await $fetch<{ jobs: ImportJob[] }>('/api/import/queue', {
                    method: 'POST',
                    body: formData,
                });

                this.queue = response.jobs;
                this.startPolling();
            } catch {
                this.toast.add({
                    id: 'import-error',
                    title: 'Erreur lors de la soumission des fichiers',
                    color: 'red',
                });
            } finally {
                this.submitting = false;
            }
        },
        startPolling() {
            this.stopPolling();
            this.pollingTimer = setInterval(() => this.fetchJobs(), 2000);
        },
        stopPolling() {
            if (this.pollingTimer) {
                clearInterval(this.pollingTimer);
                this.pollingTimer = null;
            }
        },
        async fetchJobs() {
            try {
                const response = await $fetch<{ jobs: ImportJob[] }>('/api/import/queue');
                this.queue = response.jobs;

                if (this.allDone && this.queue.length > 0) {
                    this.stopPolling();
                    if (!this.toastShown) {
                        this.toastShown = true;
                        this.toast.add({
                            id: 'import-done',
                            title: `Import terminé — ${this.totalSuccess} contenu${this.totalSuccess > 1 ? 's' : ''} importé${this.totalSuccess > 1 ? 's' : ''}`,
                            color: this.hasErrors ? 'amber' : 'green',
                        });
                    }
                }
            } catch {
                // Silently ignore fetch errors during polling
            }
        },
        cancel() {
            this.files = [];
        },
    }
});

</script>
