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
        <template v-if="tocPosition === 'start'">
            <TocPage
                v-for="(lines, i) in tocPages"
                :key="'toc-' + i"
                :lines="lines"
                :is-first="i === 0"
                :page="firstTocPage + i"
            />
        </template>
        <template
            v-for="(page, i) in bodyPages"
            :key="'body-' + page.number">
            <PartPage
                v-if="page.type === 'part'"
                :numeral="page.numeral"
                :title="page.title"
            />
            <PoemPage
                v-else
                :id="page.post.id"
                :next-page-id="textPostId(bodyPages[i + 1])"
                :prev-page-id="textPostId(bodyPages[i - 1])"
                :title="page.post.postTitle"
                :content="page.post.content"
                :page="page.number"
                :date="page.post.publishDate"
                :author="page.post.author"
                :show-signature="bookStore.config.showSignature"
            />
        </template>
        <template v-if="tocPosition === 'end'">
            <TocPage
                v-for="(lines, i) in tocPages"
                :key="'toc-' + i"
                :lines="lines"
                :is-first="i === 0"
                :page="firstTocPage + i"
            />
        </template>
        <EndPage/>
    </div>
</template>

<script lang="ts">
import CoverPage from "~/components/poems/bookPages/preliminaryPages/CoverPage.vue";
import PoemPage from "~/components/poems/bookPages/PoemPage.vue";
import BasePage from "~/components/poems/bookPages/BasePage.vue";
import EndPage from "~/components/poems/bookPages/concludingPages/EndPage.vue";
import TocPage from "~/components/poems/bookPages/TocPage.vue";
import PartPage from "~/components/poems/bookPages/PartPage.vue";
import type {PostInterface} from "~/server/models/post";
import PostEntity from "~/entities/PostEntity";
import {useBookStore} from "~/stores/bookStore";
import {layoutBook, type BodyPage, type BookPart, type TocLine, type TocPosition} from "~/utils/bookToc";
import {BOOK_TOKEN_HEADER} from "~/utils/bookAccess";

export default {
    components: {
        EndPage,
        TocPage,
        PartPage,
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
            bodyPages: [] as BodyPage[],
            tocPages: [] as TocLine[][],
            firstTocPage: 0,
            loaded: false,
            totalPages: 0,
        };
    },
    computed: {
        tocPosition(): TocPosition {
            return this.bookStore.config.tocPosition;
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
        async getPosts() {
            // Tout le livre : sans « limit », l'API ne renvoie que les 10 derniers textes.
            // Sans session (génération du PDF), le jeton de l'URL ouvre la lecture des textes et des parties.
            const token = typeof this.$route.query.token === 'string' ? this.$route.query.token : '';
            const headers = token ? {[BOOK_TOKEN_HEADER]: token} : {};
            const [data, parts] = await Promise.all([
                $fetch<{ rows: PostInterface[] }>('/api/post', {query: {limit: 'all'}, headers}),
                $fetch<BookPart[]>('/api/part', {headers}),
            ]);
            this.posts = data.rows.map((post: PostInterface) => PostEntity.hydrateFromDatabase(post));
            const layout = layoutBook(this.posts, parts, this.bookStore.layoutOptions);
            this.bodyPages = layout.bodyPages;
            this.tocPages = layout.tocPages;
            this.firstTocPage = layout.firstTocPage;
            this.totalPages = layout.bodyPages.length;
            this.loaded = true;
        },
        // Id du texte d'une page voisine (undefined pour une page de partie ou hors du livre)
        textPostId(page: BodyPage | undefined) {
            return page?.type === 'text' ? page.post.id : undefined;
        },
    }
};

</script>

<style>
p {
    white-space: pre-line;
}
</style>
