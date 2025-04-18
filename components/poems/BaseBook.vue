<template>
    <div
        class="flex flex-wrap gap-4 justify-center h-full"
    >
        <div
            v-for="(post, i) in posts"
            :key="post.id"
            class="page-preview flex-1 h-fit p-4"
        >
            <h2 class="title">{{ post.postTitle }}</h2>
            <span
                class="p-4"
                v-html="post.content">

            </span>
            <p>{{ post.date.toLocaleDateString('fr') }} - {{ post.author }}</p>

        </div>
    </div>
    <BasePagination
        :page="page"
        :countPage="countPage"
        :limit="limit"
        @prevPage="prevPage"
        @nextPage="nextPage"
        @page="setPage"
    />
</template>

<script lang="ts">

import {type PostEntityInterface} from "~/entities/PostEntity.js";
import BasePagination from "~/components/BasePagination.vue";
import BasePage from "~/components/poems/bookPages/BasePage.vue";

export default {
    components: {BasePage, BasePagination},
    emits: ['page', 'limit'],
    props: {
        posts: {
            type: Array as PropType<PostEntityInterface[]>,
            default: () => [],
        },
        totalRecords: {
            type: Number,
            default: 0,
        },
        limit: {
            type: Number,
            default: 2,
        },
    },
    data() {
        return {
            poems: [] as any,
            loaded: false,
            count: 1,
            page: 1,
            filters: {
                year: null
            }
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
    methods: {
        prevPage() {
            this.page--
            this.$emit('page', this.page)
        },
        nextPage() {
            this.page++
            this.$emit('page', this.page)
        },
        setPage(page: number) {
            this.page = page
            this.$emit('page', page)
        },
    }
}
</script>