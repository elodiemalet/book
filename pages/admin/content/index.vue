<template>
    <NuxtLayout name="admin-page">
        <template #title>Liste des contenus</template>
        <BaseTable
            :columns="columns"
            :rows="posts"
            @action="doAction"
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
            limit: 2,
            filters: {
                year: null
            },
            totalRecords: 0
        }
    },
    async mounted() {
        await this.getPosts()
    },
    methods: {
        async getPosts() {
            await fetch('/api/post')
                .then(response => response.json())
                .then(data => {
                    this.posts = data.map((post: PostInterface) => {
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