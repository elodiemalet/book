<template>
    <NuxtLayout name="admin-page">
        <template #title>Mon livre</template>
        <base-book
            v-if="posts.length"
            :totalRecords="totalRecords"
            :posts="posts"
            @page="setPage"
            @limit="limit = $event"
        />
    </NuxtLayout>
</template>

<script lang="ts">

import PostEntity, {type PostEntityInterface} from "~/entities/PostEntity";
import PoemPage from "~/components/poems/bookPages/PoemPage.vue";
import BaseBook from "~/components/poems/BaseBook.vue";
import type {PostInterface} from "~/server/models/post";

export default {
    components: {BaseBook, PoemPage},
    data() {
        return {
            posts: [] as PostEntityInterface[],
            totalRecords: 0,
            loaded: false,
            count: 1,
            page: 1,
            limit: 2,
            filters: {
                year: null
            },
        }
    },
    mounted() {
        this.getPosts()
    },
    methods: {
        setPage(page: number) {
            this.page = page
            this.getPosts()
        },
        async getPosts() {
            await fetch(`/api/post?limit=${this.limit}&page=${this.page}`)
                .then(response => response.json())
                .then(data => {
                    this.totalRecords = data.count
                    this.posts = data.rows.map((post: PostInterface) => {
                        const postEntity = PostEntity.hydrateFromDatabase(post)

                        return {
                            ...postEntity,
                        }
                    })
                })


        },
    }
}

</script>

