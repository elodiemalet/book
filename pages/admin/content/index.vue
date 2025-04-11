<template>
    <NuxtLayout name="admin-page">
        <template #title>Liste des contenus</template>
        <BaseTable
            :columns="columns"
            :rows="posts"
            @action="doAction"
        />
        <BasePagination
            :page="page"
            :countPage="countPage"
            :limit="limit"
            @prevPage="prevPage"
            @nextPage="nextPage"
            @page="setPage"
        />
    </NuxtLayout>
</template>

<script lang="ts">
import BaseTable from "~/components/ui/BaseTable.vue";

export default {
    components: {BaseTable},
    setup() {
        useState("addUrl", () => "/admin/content/add");
        const toast = useToast()
        return {
            toast
        }
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
            posts: [] as any,
            loaded: false,
            count: 1,
            page: 1,
            limit: 10,
            filters: {
                year: null
            },
            totalRecords: 0
        }
    },
    computed: {
        countPage() {
            if (this.totalRecords === 0) {
                return 0
            }
            return Math.ceil(this.totalRecords / this.limit)
        }
    },
    async mounted() {
        await this.getPosts()
    },
    methods: {
        async prevPage() {
            this.page--
            await this.getPosts()
        },
        async nextPage() {
            this.page++
            await this.getPosts()
        },
        async setPage(page: number) {
            this.page = page
            await this.getPosts()
        },
        async getPosts() {
            await fetch(`/api/post?limit=${this.limit}&page=${this.page}`)
                .then(response => response.json())
                .then(data => {
                    this.totalRecords = data.count
                    this.posts = data.rows.map((post: PostInterface) => {
                        const postEntity = PostEntity.hydrateFromDatabase(post)
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
                        ]

                        return {
                            ...postEntity,
                            actions,
                        }
                    })
                })
        },
        async doAction(action: string) {
            if (action === 'delete') {
                this.toast.add({
                    id: 'delete',
                    title: 'Confirmation de suppression',
                });
            }
        },

    }
}


import PoemImportForm from "~/components/admin/import/PoemImportForm.vue";
import type {PostInterface} from "~/server/models/post";
import PostEntity from "~/entities/PostEntity";
</script>