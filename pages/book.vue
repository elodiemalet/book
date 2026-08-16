<template>
    <div
        v-if="loaded && bookStore.configLoaded"
        class="flex flex-col items-center w-full book"
        :class="bookStore.bookCssClass">
        <CoverPage/>
        <BasePage>
            <!--            Page de faux-titre : Contient simplement le titre du recueil ou une citation évocatrice.-->
            <h1 class="title">{{ bookStore.config.title }}</h1>
            <h3 class="title">{{ bookStore.config.author }}</h3>
            <h4 class="title">{{ bookStore.config.years }}</h4>
        </BasePage>
        <BasePage v-if="bookStore.config.dedicationText">

            <!--            Dédicace : Une page où l'auteur peut dédier le recueil à une personne ou exprimer un hommage.-->
            <h2 class="title">Dédicace</h2>
            <p
                v-for="(paragraph, i) in dedicationParagraphs"
                :key="'ded-' + i"
                class="text-left">{{ paragraph }}</p>

        </BasePage>
        <BasePage v-if="bookStore.config.prefaceText">

            <h2 class="title">Préface</h2>
            <p
                v-for="(paragraph, i) in prefaceParagraphs"
                :key="'pre-' + i"
                class="text-left">{{ paragraph }}</p>

        </BasePage>
        <PoemPage
            v-for="(page, i) in pages"
            :id="page.id"
            :key="page.id + '-' + i"
            :next-page-id="pages[i + 1]?.id"
            :prev-page-id="pages[i - 1]?.id"
            :title="page.postTitle"
            :content="page.content"
            :page="i + pageStart"
            :date="page.date"
            :author="page.author"
        />
        <EndPage/>
    </div>
</template>

<script lang="ts">
import CoverPage from "~/components/poems/bookPages/preliminaryPages/CoverPage.vue";
import PoemPage from "~/components/poems/bookPages/PoemPage.vue";
import BasePage from "~/components/poems/bookPages/BasePage.vue";
import EndPage from "~/components/poems/bookPages/concludingPages/EndPage.vue";
import type {PostInterface} from "~/server/models/post";
import PostEntity from "~/entities/PostEntity";
import {useBookStore} from "~/stores/bookStore";

export default {
    components: {
        EndPage,
        PoemPage,
        BasePage,
        CoverPage,
    },
    setup() {
        definePageMeta({
            layout: 'book',
            middleware: ['protect-book'],
        });
        const bookStore = useBookStore();
        const bookCssClass = computed(() => bookStore.bookCssClass);
        const pageStyle = computed(() => `@page { size: ${bookStore.pageSize}; margin: 0; }`);
        useHead({
            bodyAttrs: {
                class: bookCssClass,
                'data-theme': 'dark'
            },
            style: [{innerHTML: pageStyle}],
        });
    },
    data() {
        const bookStore = useBookStore();
        bookStore.fetchImagePages();
        return {
            bookStore,
            posts: [] as PostEntity[],
            pages: [] as PostEntity[],
            loaded: false,
            totalPages: 0,
        };
    },
    computed: {
        pageStart(): number {
            return this.bookStore.config.pageStart;
        },
        maxLines(): number {
            return this.bookStore.effectiveMaxLines;
        },
        maxLinesFirstPage(): number {
            return this.bookStore.effectiveMaxLinesFirstPage;
        },
        dedicationParagraphs(): string[] {
            return (this.bookStore.config.dedicationText || '').split('\n').filter((p: string) => p.trim() !== '');
        },
        prefaceParagraphs(): string[] {
            return (this.bookStore.config.prefaceText || '').split('\n').filter((p: string) => p.trim() !== '');
        },
    },
    async mounted() {
        await this.bookStore.fetchConfig();
        this.getPosts();
    },
    methods: {
        getPosts() {
            fetch('/api/post')
                .then(response => response.json())
                .then(data => {
                    this.posts = data.rows.map((post: PostInterface) => {
                        return PostEntity.hydrateFromDatabase(post);
                    });
                    this.pages = paginatePosts(this.posts, {
                        maxLines: this.maxLines,
                        maxLinesFirstPage: this.maxLinesFirstPage,
                        maxCharsPerLine: this.bookStore.maxCharsPerLine,
                    });
                    this.totalPages = this.pages.length;
                    this.loaded = true;
                });
        },
    }
};

</script>

<style>
p {
    white-space: pre-line;
}
</style>
