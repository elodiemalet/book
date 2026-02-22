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
                    this.pages = this.paginatePosts(this.posts);
                    this.totalPages = this.pages.length;
                    this.loaded = true;
                });
        },
        // Count how many visual lines a text line takes (accounting for wrapping)
        visualLineCount(line: string): number {
            const maxChars = this.bookStore.maxCharsPerLine;
            if (line.length <= maxChars) return 1;
            return Math.ceil(line.length / maxChars);
        },
        // Collect lines from array until visual line budget is spent
        // Returns the number of source lines consumed
        fillPage(lines: string[], maxVisualLines: number): number {
            let visualCount = 0;
            let consumed = 0;
            for (let i = 0; i < lines.length; i++) {
                const cost = this.visualLineCount(lines[i]);
                if (visualCount + cost > maxVisualLines && consumed > 0) break;
                visualCount += cost;
                consumed++;
            }
            return consumed;
        },
        paginatePosts(posts: PostEntity[]): PostEntity[] {
            const pages: PostEntity[] = [];
            // Visual lines reserved for author/date footer on the last page
            const footerLines = 4;

            for (const post of posts) {
                const lines = post.content.split('\n');

                // Single-page poem: title + content + author/date footer must fit
                const singlePageCount = this.fillPage(lines, this.maxLinesFirstPage - footerLines);
                if (singlePageCount >= lines.length) {
                    pages.push(post);
                    continue;
                }

                // Multi-page poem
                // First page (title takes space, no footer)
                let offset = 0;
                const firstCount = this.fillPage(lines, this.maxLinesFirstPage);
                const firstChunk = lines.slice(0, firstCount).join('\n');
                pages.push(new PostEntity(
                    post.id, post.postTitle, post.author,
                    firstChunk, post.timestamp, post.publishDate
                ));
                offset = firstCount;

                // Continuation pages
                while (offset < lines.length) {
                    const remaining = lines.slice(offset);
                    // Check if remaining fits on last page (with footer)
                    const lastPageCount = this.fillPage(remaining, this.maxLines - footerLines);
                    const isLastChunk = lastPageCount >= remaining.length;
                    const count = isLastChunk
                        ? remaining.length
                        : this.fillPage(remaining, this.maxLines);
                    const chunk = remaining.slice(0, count).join('\n');
                    pages.push(new PostEntity(
                        post.id, post.postTitle, post.author,
                        chunk, post.timestamp, post.publishDate
                    ));
                    offset += count;
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
