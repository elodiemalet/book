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
                class="text-left"
                style="white-space: pre-line;">{{ bookStore.config.dedicationText }}</p>

        </BasePage>
        <BasePage v-if="bookStore.config.prefaceText">

            <h2 class="title">Préface</h2>
            <p
                class="text-left"
                style="white-space: pre-line;">{{ bookStore.config.prefaceText }}</p>

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
        useHead({
            bodyAttrs: {
                class: bookCssClass,
                'data-theme': 'dark'
            }
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
            return this.bookStore.config.maxLines;
        },
        maxLinesFirstPage(): number {
            return this.bookStore.config.maxLinesFirstPage;
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
                    this.pages = this.paginatePosts(this.posts);
                    this.totalPages = this.pages.length;
                    this.loaded = true;
                });
        },
        paginatePosts(posts: PostEntity[]): PostEntity[] {
            const pages: PostEntity[] = [];

            for (const post of posts) {
                const lines = post.content.split('\n');

                if (lines.length <= this.maxLinesFirstPage) {
                    pages.push(post);
                    continue;
                }

                // First page has fewer lines (title + author take space)
                let offset = 0;
                const firstChunk = lines.slice(0, this.maxLinesFirstPage).join('\n');
                pages.push(new PostEntity(
                    post.id, post.postTitle, post.author,
                    firstChunk, post.timestamp, post.publishDate
                ));
                offset = this.maxLinesFirstPage;

                // Continuation pages
                while (offset < lines.length) {
                    const chunk = lines.slice(offset, offset + this.maxLines).join('\n');
                    pages.push(new PostEntity(
                        post.id, post.postTitle, post.author,
                        chunk, post.timestamp, post.publishDate
                    ));
                    offset += this.maxLines;
                }
            }

            return pages;
        }
    }
};

</script>

<style>
p {
    white-space: pre-line;
}
</style>
