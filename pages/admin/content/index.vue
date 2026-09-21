<template>
    <NuxtLayout name="admin-page">
        <template #title>Liste des contenus</template>
        <BaseTable
            class="mt-8"
            :columns="columns"
            :rows="posts"
            @action="doAction"
        />
        <BasePagination
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
import BaseTable from "~/components/ui/BaseTable.vue";
import type {PostInterface} from "~/server/models/post";
import PostEntity from "~/entities/PostEntity";
import type {PostEntityInterface} from "~/entities/PostEntity";

export default {
    components: {BaseTable},
    setup() {
        useState("addUrl", () => "/admin/content/add");
        const toast = useToast();
        return {
            toast
        };
    },
    data() {
        return {
            columns: [
                {name: 'Auteur', key: 'author', bold: true},
                {name: 'Titre', key: 'postTitle'},
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
                    color: 'red',
                    timeout: 0,
                    actions: [
                        {label: 'Supprimer', color: 'red', click: () => this.deletePost(row)},
                        {label: 'Annuler', color: 'gray', variant: 'ghost'},
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
                    color: 'red',
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
