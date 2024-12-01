<template>
    <div class="flex flex-wrap justify-center h-full">
        <div
            v-for="(post, i) in posts"
            :key="post.id"
            class="page poem flex-1 h-[calc(100vh-10rem)] max-h-[297mm] p-4"
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
</template>

<script lang="ts">

import {usePostStore} from "~/stores/postStore.js";
import {useCounter} from "@vueuse/shared";
import PostModel from "~/models/PostModel.js";
import PageThanks from "~/components/bookPages/PageThanks.vue";
import PagePresentation from "~/components/bookPages/PageCover.vue";
import BasePagination from "~/components/BasePagination.vue";

export default {
    components: {BasePagination, PagePresentation, PageThanks},
    data() {
        return {
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

    },
    methods: {
        useCounter,
        async getPosts() {
            await this.postStore.fetchPosts(this.token, this.page, this.limit, this.filters)
            const posts = this.postStore.posts
            this.totalRecords = await this.postStore.countPosts(this.token, this.filters)

            this.posts = posts.map((post: PostInterface) => {
                return PostModel.hydrate(
                    post
                )
            })
        }
    }
}
</script>