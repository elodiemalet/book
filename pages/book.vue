<template>
    <div v-if="loaded">
        <PagePresentation/>
        <PageThanks/>
        <div
            v-for="(post, i) in posts"
            :key="post.id"
            class="page poem"
        >
            <h2>{{ post.postTitle }}</h2>
            <p>{{ post.content }}</p>
            <p>{{ post.date.toLocaleDateString('fr') }} - {{ post.author }}</p>
            <footer>
                <p>{{ i + 1 }}</p>
            </footer>
        </div>
    </div>
</template>

<script lang="ts">
import PagePresentation from "~/components/bookPages/PageCover.vue";
import PageThanks from "~/components/bookPages/PageThanks.vue";
import {useCounter} from "@vueuse/shared";
import {usePostStore} from "~/stores/postStore";
import PostModel, {type PostInterface} from "~/models/PostModel";

export default {
    components: {
        PagePresentation,
        PageThanks
    },
    data() {
        return {
            token: null,
            posts: [] as any,
            loaded: false
        }
    },
    setup() {
        const postStore = usePostStore()

        return {
            postStore,
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

            this.posts = posts.map((post: PostInterface) => {
                return PostModel.hydrate(
                    post
                )
            })
        }
    }
    // async mounted() {
    //     const bookFromStorage = localStorage.getItem('bookStore')
    //     if (bookFromStorage) {
    //         this.book = new BookModel(JSON.parse(bookFromStorage)?.poems)
    //     } else {
    //         const token = this.$route?.query?.token
    //         await this.bookStore.fetchBooks(token)
    //         this.book = new BookModel(this.bookStore.book.poems)
    //     }
    //
    //     this.loaded = true
    // }
}

</script>

<style>
p {
    white-space: pre-line;
}
</style>