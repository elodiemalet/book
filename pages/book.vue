<template>
    <div
        v-if="loaded"
        class="flex flex-col items-center w-full book book-a4">
        <CoverPage/>
        <BasePage>
            <!--            Page de faux-titre : Contient simplement le titre du recueil ou une citation évocatrice.-->
            <h1 class="title">Recueil de Poèmes</h1>
            <h3 class="title"></h3>
            <h4 class="title">2019 - 2024</h4>
        </BasePage>
        <BasePage>

            <!--            Dédicace : Une page où l’auteur peut dédier le recueil à une personne ou exprimer un hommage.-->
            <h2 class="title">Dédicace</h2>
            
            <div>
                <img
                    src="/images/fleur.png"
                    alt="Fleur">
            </div>

        </BasePage>
        <BasePage>

            <h2 class="title">Préface</h2>
            <p class="text-left">
                Ce recueil de poèmes est le fruit de plusieurs années de travail.
            </p>
            <p class="text-left">
                Il regroupe des textes écrits entre 2019 et 2024.
            </p>
            <p class="text-left">
                L’auteur y partage ses pensées, ses émotions et ses
                réflexions à travers ses poèmes.
            </p>
            <p class="text-left">
                J'espère que vous prendrez autant de plaisir à les lire qu’il en a eu à les écrire.
            </p>

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
        const className = 'book-a4'
        useHead({
            bodyAttrs: {
                class: className,
                'data-theme': 'dark'
            }
        })
    },
    data() {
        const bookStore = useBookStore();
        bookStore.fetchImagePages();
        return {
            posts: [] as PostEntity[],
            pages: [] as PostEntity[],
            loaded: false,
            pageStart: 6,
            totalPages: 0,
            maxLines: 38,
            maxLinesFirstPage: 32,
        };
    },
    mounted() {
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
