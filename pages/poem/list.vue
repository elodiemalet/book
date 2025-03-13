<template>
    <div class="flex flex-wrap gap-4 justify-center h-full">
        <div
            v-for="(post, i) in posts"
            :key="post.id"
            class="page page-book poem flex-1 h-[calc(100vh-10rem)] max-h-[228.6mm] p-4"
        >
            <h2>{{ post.postTitle }}</h2>
            <p>{{ post.content }}</p>
            <p>{{ post.date.toLocaleDateString('fr') }} - {{ post.author }}</p>
            <footer>
                <p>{{ i + 1 + (page - 1) * limit }} </p>
            </footer>
        </div>
    </div>
    <BasePagination
        :page="page"
        :countPage="countPage"
        :limit="limit"
        @prevPage="page--"
        @nextPage="page++"
        @page="page = $event"
    />
    <div
        v-if="poems.length">
        <h2>Liste des poèmes</h2>
        <div class="grid grid-cols-2 gap-4 justify-items-center bg-gray-200">
            <BasePage v-for="(poem, i) in poems" :key="i">
                <p>{{ poem.postTitle }}</p>
                <p>{{ poem.content }}</p>
                <p>{{ poem.date.toLocaleDateString('fr') }} - {{ poem.author }}</p>
            </BasePage>
        </div>
    </div>
</template>

<script lang="ts">

import {usePostStore} from "~/stores/postStore.js";
import {useCounter} from "@vueuse/shared";
import PostEntity, {type PostEntityInterface} from "~/entities/PostEntity.js";
import BasePagination from "~/components/BasePagination.vue";
import BasePage from "~/components/bookPages/BasePage.vue";
import type {PostInterface} from "~/server/models/post";

export default {
    components: {BasePage, BasePagination},
    data() {
        return {
            token: null,
            posts: [] as any,
            poems: [] as any,
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
    setup() {
        const postStore = usePostStore()

        return {
            postStore,
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
    watch: {
        async page() {
            await this.getPosts()
        },
        async limit() {
            await this.getPosts()
        },
    },
    async mounted() {
        this.token = this.$route?.query?.token
        await this.getPosts()
        this.loaded = true
        await fetch('/api/post')
            .then(response => response.json())
            .then(data => {
                this.poems = data.map((post: PostInterface) => {
                    return PostEntity.hydrateFromDatabase(post)
                })
            })
    },
    methods: {
        async getPosts() {
            await this.postStore.fetchPosts(this.token, this.page, this.limit, this.filters)
            const posts = this.postStore.posts
            this.totalRecords = await this.postStore.countPosts(this.token, this.filters)

            this.posts = posts.map((post: PostEntityInterface) => {
                return PostEntity.hydrate(
                    post
                )
            })
        }
    }
}
</script>