<template>
    <NuxtLayout name="admin-page">
        <template #title>Contenus</template>
        <template #subtitle>
            {{ totalRecords }} texte{{ totalRecords > 1 ? 's' : '' }} dans le livre
        </template>
        <template #buttons>
            <BaseButton @click="navigateTo('/admin/content/add')">
                <PlusIcon
                    class="mr-2 -ml-1 size-4"
                    aria-hidden="true"/>
                Ajouter un contenu
            </BaseButton>
        </template>
        <BaseTable
            :columns="columns"
            :rows="posts"
            empty-label="Aucun texte pour l'instant : ajoutez-en un ou importez vos fichiers."
            @action="doAction"
        >
            <template #column-postTitle="{row}">
                <NuxtLink
                    :to="`/admin/content/${row.id}/edit`"
                    class="font-newsreader text-[17px] text-atelier-ink hover:text-lilas-light"
                >
                    {{ row.postTitle }}
                </NuxtLink>
            </template>
        </BaseTable>
        <BasePagination
            class="mt-6 justify-end"
            :page="page"
            :count-page="countPage"
            :limit="limit"
            @prev-page="prevPage"
            @next-page="nextPage"
            @page="setPage"
        />
    </NuxtLayout>
</template>

<script lang="ts">
import {PlusIcon} from "@heroicons/vue/24/outline";
import BaseTable from "~/components/ui/BaseTable.vue";
import BaseButton from "~/components/ui/buttons/BaseButton.vue";
import type {PostInterface} from "~/server/models/post";
import PostEntity from "~/entities/PostEntity";
import type {PostEntityInterface} from "~/entities/PostEntity";

export default {
    components: {BaseTable, BaseButton, PlusIcon},
    setup() {
        const toast = useToast();
        return {
            toast
        };
    },
    data() {
        return {
            columns: [
                {name: 'Titre', key: 'postTitle', bold: true},
                {name: 'Auteur', key: 'author'},
                {name: 'Date', key: 'date', type: 'date'},
                {name: '', key: 'actions', type: 'actions'},
            ],
            token: null,
            posts: [],
            loaded: false,
            count: 1,
            page: 1,
            limit: 10,
            filters: {
                year: null
            },
            totalRecords: 0
        };
    },
    computed: {
        countPage() {
            if (this.totalRecords === 0) {
                return 0;
            }
            return Math.ceil(this.totalRecords / this.limit);
        }
    },
    async mounted() {
        await this.getPosts();
    },
    methods: {
        async prevPage() {
            this.page--;
            await this.getPosts();
        },
        async nextPage() {
            this.page++;
            await this.getPosts();
        },
        async setPage(page: number) {
            this.page = page;
            await this.getPosts();
        },
        async getPosts() {
            await fetch(`/api/post?limit=${this.limit}&page=${this.page}`)
                .then(response => response.json())
                .then(data => {
                    this.totalRecords = data.count;
                    this.posts = data.rows.map((post: PostInterface) => {
                        const postEntity = PostEntity.hydrateFromDatabase(post);
                        const actions = [
                            {
                                title: 'Modifier',
                                type: 'link',
                                actionType: 'edit',
                                action: `/admin/content/${postEntity.id}/edit`,
                            },
                            {
                                title: 'Supprimer',
                                type: 'emit',
                                actionType: 'delete',
                                action: 'delete',
                            },
                        ];

                        return {
                            ...postEntity,
                            actions,
                        };
                    });
                });
        },
        async doAction({action, row}: {action: string, row: PostEntityInterface}) {
            if (action === 'delete') {
                this.toast.add({
                    id: 'delete',
                    title: 'Confirmation de suppression',
                    description: `Supprimer « ${row.postTitle} » ? Cette action est définitive.`,
                    color: 'error',
                    duration: 0,
                    actions: [
                        {label: 'Supprimer', color: 'error', onClick: () => this.deletePost(row)},
                        {label: 'Annuler', color: 'neutral', variant: 'ghost'},
                    ],
                });
            }
        },
        async deletePost(post: PostEntityInterface) {
            try {
                await $fetch(`/api/post/${post.id}`, {method: 'DELETE'});
            } catch {
                this.toast.add({
                    id: 'error',
                    title: 'Erreur lors de la suppression du contenu',
                    color: 'error',
                });
                return;
            }

            this.toast.add({
                id: 'success',
                title: 'Contenu supprimé avec succès',
            });
            // Si on vient de vider la dernière page, on revient à la précédente
            if (this.posts.length === 1 && this.page > 1) {
                this.page--;
            }
            await this.getPosts();
        },

    }
};
</script>
