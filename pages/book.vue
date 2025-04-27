<template>
    <div v-if="loaded" class="flex flex-col items-center w-full ">
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
                <img src="/images/fleur.png"/>
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
            v-for="(post, i) in posts"
            :key="post.id"
            :id="post.id"
            :next-page-id="posts[i + 1]?.id"
            :prev-page-id="posts[i - 1]?.id"
            :title="post.postTitle"
            :content="post.content"
            :page="i + pageStart"
            :date="post.date"
            :author="post.author"
        />
        <EndPage/>
    </div>
</template>

<script lang="ts">
import CoverPage from "~/components/poems/bookPages/preliminaryPages/CoverPage.vue";
import PoemPage from "~/components/poems/bookPages/PoemPage.vue";
import BasePage from "~/components/poems/bookPages/BasePage.vue";
import ThanksPage from "~/components/poems/bookPages/concludingPages/ThanksPage.vue";
import EndPage from "~/components/poems/bookPages/concludingPages/EndPage.vue";
import type {PostInterface} from "~/server/models/post";
import PostEntity from "~/entities/PostEntity";

export default {
    components: {
        EndPage,
        PoemPage,
        BasePage,
        CoverPage,
        ThanksPage
    },
    data() {
        const bookStore = useBookStore();
        bookStore.fetchImagePages()
        return {
            posts: [] as any,
            loaded: false,
            pageStart: 6,
            totalPages: 0,
            maxLines: 42,
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
    mounted() {
        this.getPosts()
        this.totalPages = Math.ceil(this.posts.length)
        this.loaded = true
    },
    methods: {
        getPosts() {
            fetch('/api/post')
                .then(response => response.json())
                .then(data => {
                    this.posts = data.rows.map((post: PostInterface) => {
                        return PostEntity.hydrateFromDatabase(post)
                    })
                })
        }
    }
}

</script>

<style>
p {
    white-space: pre-line;
}
</style>