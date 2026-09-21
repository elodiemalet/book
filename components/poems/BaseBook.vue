<template>
    <div
        class="flex flex-wrap gap-4 justify-center h-full"
    >
        <div
            v-for="(post, i) in posts"
            :key="i"
            class="page-preview flex-1 h-fit p-4"
        >
            <h2 class="title">{{ post.postTitle }}</h2>
            <SafeHtml
                :raw-html="post.content"
                class="p-4"/>
            <p v-if="bookStore.config.showSignature">{{ formatSignature(post.author, post.publishDate) }}</p>

        </div>
    </div>
    <BasePagination
        :page="page"
        :count-page="countPage"
        :limit="limit"
        @prev-page="prevPage"
        @next-page="nextPage"
        @page="setPage"
    />
</template>

<script lang="ts">

import type {PostEntityInterface} from "~/entities/PostEntity.js";
import BasePagination from "~/components/BasePagination.vue";
import SafeHtml from "~/components/layout/SafeHtml.vue";
import {formatSignature} from "~/utils/signature";
import {useBookStore} from "~/stores/bookStore";

export default {
    components: {SafeHtml, BasePagination},
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
    emits: ['page', 'limit'],
    data() {
        return {
            bookStore: useBookStore(),
            poems: [],
            loaded: false,
            count: 1,
            page: 1,
            filters: {
                year: null
            }
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
        if (!this.bookStore.configLoaded) {
            await this.bookStore.fetchConfig();
        }
    },
    methods: {
        formatSignature,
        prevPage() {
            this.page--;
            this.$emit('page', this.page);
        },
        nextPage() {
            this.page++;
            this.$emit('page', this.page);
        },
        setPage(page: number) {
            this.page = page;
            this.$emit('page', page);
        },
    }
};
</script>
