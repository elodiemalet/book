<template>
    <div v-if="loaded" class="flex flex-col items-center w-full ">
        <CoverPage/>
        <BasePage/>
        <BasePage>
            <!--            Page de faux-titre : Contient simplement le titre du recueil ou une citation évocatrice.-->
            <h1>Recueil de Poèmes</h1>
            <h3></h3>
            <h4>2019 - 2024</h4>

        </BasePage>
        <BasePage>

            <!--            Dédicace : Une page où l’auteur peut dédier le recueil à une personne ou exprimer un hommage.-->
            <h2>Dédicace</h2>
            
            <div>
                <img src="/images/fleur.png"/>
            </div>

        </BasePage>
        <BasePage>

            <h2>Préface</h2>
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
        <BasePage/>

        <template
            v-for="(post, i) in posts"
            :key="post.id"
        >
            <PoemPage
                :id="post.id"
                :next-page-id="posts[i + 1]?.id"
                :prev-page-id="posts[i - 1]?.id"
                :title="post.postTitle"
                :content="post.content"
                :page="i + pageStart"
                :date="post.date"
                :author="post.author"
            />
        </template>
        <BasePage/>
        <EndPage/>
    </div>
</template>

<script lang="ts">
import CoverPage from "~/components/bookPages/preliminaryPages/CoverPage.vue";
import {usePostStore} from "~/stores/postStore";
import PostEntity, {type PostEntityInterface} from "~/entities/PostEntity";
import PoemPage from "~/components/bookPages/PoemPage.vue";
import BasePage from "~/components/bookPages/BasePage.vue";
import ThanksPage from "~/components/bookPages/concludingPages/ThanksPage.vue";
import EndPage from "~/components/bookPages/concludingPages/EndPage.vue";

export default {
    components: {
        EndPage,
        PoemPage,
        BasePage,
        CoverPage,
        ThanksPage
    },
    data() {
        return {
            token: null,
            posts: [] as any,
            loaded: false,
            pageStart: 6,
            totalPages: 0,
            maxLines: 42,
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
        this.totalPages = Math.ceil(this.posts.length)
        this.loaded = true

    },
    methods: {
        async getPosts() {
            await this.postStore.fetchPosts(this.token)
            const posts = this.postStore.posts


            posts.map((post: PostEntityInterface) => {
                // cut each 15 lines in the content
                const parts = post.content.split('\n')
                if (parts.length <= this.maxLines) {
                    this.posts.push(PostEntity.hydrate(
                        post
                    ))
                    return
                }


                const content = parts.reduce((acc: any[], line, index) => {
                    if (index % this.maxLines === 0) {
                        acc.push('')
                    }
                    acc[acc.length - 1] += line + '\n'
                    return acc
                }, [])


                content.forEach((contentSplited, index) => {

                    const postModel = PostEntity.hydrate(
                        {
                            ...post,
                            content: contentSplited,
                        }
                    )

                    this.posts.push(postModel)
                })
            })
        },
    }
}

</script>

<style>
p {
    white-space: pre-line;
}
</style>