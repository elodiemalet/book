<template>
    <section
        aria-label="Aperçu du livre"
        class="flex flex-col items-center gap-6"
    >
        <article
            v-for="(post, i) in posts"
            :key="i"
            class="page-preview relative w-full max-w-[520px] bg-page px-8 pt-12 pb-16 font-newsreader text-page-ink shadow-page sm:px-14 sm:pt-16"
        >
            <h2 class="title mb-6 text-2xl font-normal italic">{{ post.postTitle }}</h2>
            <SafeHtml
                :raw-html="post.content"
                class="text-[17px] leading-relaxed"/>
            <p
                v-if="bookStore.config.showSignature"
                class="mt-8 text-sm text-page-muted italic">{{ formatSignature(post.author, post.publishDate) }}</p>
            <span class="absolute inset-x-0 bottom-5 text-center text-xs text-page-muted tabular-nums">{{ (page - 1) * limit + i + 1 }}</span>
        </article>
        <div class="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
            <p class="text-[13px] text-atelier-muted tabular-nums">
                <template v-if="limit === 1">Texte {{ page }} <span class="text-atelier-subtle">sur {{ totalRecords }}</span></template>
                <template v-else>Page {{ page }} <span class="text-atelier-subtle">sur {{ countPage }}</span></template>
            </p>
            <BasePagination
                :page="page"
                :count-page="countPage"
                :limit="limit"
                @prev-page="prevPage"
                @next-page="nextPage"
                @page="setPage"
            />
        </div>
    </section>
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
