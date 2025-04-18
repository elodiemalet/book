<template>
    <div class="flex flex-wrap gap-4 justify-center h-full">
        <div
            v-for="(post, i) in posts"
            :key="post.id"
            class="page page-book poem flex-1 h-[calc(100vh-10rem)] max-h-[228.6mm] p-4"
        >
            <h2 class="title">{{ post.postTitle }}</h2>
            <p><span v-html="post.content"></span></p>
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

import PostEntity, {type PostEntityInterface} from "~/entities/PostEntity.js";
import BasePagination from "~/components/BasePagination.vue";
import BasePage from "~/components/poems/bookPages/BasePage.vue";
import type {PostInterface} from "~/server/models/post";

export default {
    components: {BasePage, BasePagination},
    data() {
        return {
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
        await this.getPosts()
        this.loaded = true
    },
    methods: {
        async getPosts() {

            await fetch(`/api/post?limit=${this.limit}&page=${this.page}`)
                .then(response => response.json())
                .then(data => {
                    this.totalRecords = data.count
                    this.posts = data.rows.map((post: PostInterface) => {
                        return PostEntity.hydrateFromDatabase(post)
                    })
                })
        }
    }
}
</script>