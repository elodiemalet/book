<template>
    <header class="overflow-hidden bg-slate-100 lg:bg-transparent lg:px-5">
        <div
            class="mx-auto grid max-w-6xl grid-cols-1 grid-rows-[auto_1fr] gap-y-16 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-y-20 lg:px-3 lg:pt-20 lg:pb-36 xl:py-32">
            <div class="relative flex items-end lg:col-span-5 lg:row-span-2">
                <div
                    class="overflow-hidden absolute -top-20 right-1/2 -bottom-12 left-0 z-10 rounded-br-6xl  bg-cover  text-white/10 md:bottom-8 lg:-inset-y-32 lg:right-full lg:left-[-100vw] lg:-mr-40 "
                >
                    <GlassImage/>
                    <div class="glass-effect absolute inset-0 z-10">
                    </div>
                    <img class="w-full" :src="coverImage?.url" :alt="coverImage?.name"/>
                </div>

                <div
                    class="relative z-10 mx-auto flex w-64 rounded-xl bg-slate-600 shadow-xl md:w-80 lg:w-auto">
                    <img class="w-full" :src="coverImage?.url" :alt="coverImage?.name"/>
                </div>
            </div>
            <div class="relative px-4 sm:px-6 lg:col-span-7 lg:pr-0 lg:pb-14 lg:pl-16 xl:pl-20">
                <div
                    class="hidden lg:absolute lg:-top-32 lg:right-[-100vw] lg:bottom-0 lg:left-[-100vw] lg:block lg:bg-slate-100"/>
                <Testimonial
                    :author="{
                        name: 'John Doe',
                        role: 'Founder at MissingNo Inc.',
                        image: null,

                    }"
                >
                    "Ce livre, c'est le meilleur livre que j'ai jamais lu. Je suis heureux de pouvoir le partager avec
                    vous."
                </Testimonial>
            </div>
            <div class="bg-white pt-16 lg:col-span-7 lg:bg-transparent lg:pt-0 lg:pl-16 xl:pl-20">
                <div class="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
                    <h1 class="font-display text-5xl font-extrabold text-slate-900 sm:text-6xl">
                        Plongez dans l’univers de vos propres contenus.
                    </h1>
                    <p class="mt-4 text-3xl text-slate-600">
                        Un e-book (et bientôt plus) généré à partir de ce que vous avez à dire, à montrer, ou à
                        transmettre.</p>
                    <p class="mt-4 text-3xl font-bold">Créez. Structurez. Partagez.</p>
                    <p class="mt-4 text-xl text-slate-600">Votre livre, à votre image — qu’il s’agisse de
                        poèmes, de
                        récits, de documents pro ou de
                        réflexions personnelles.
                    </p>
                    <div class="mt-8 flex gap-4">
                        <BaseButton
                            @click="goToFreeSample"
                        >
                            Découvrez un extrait
                        </BaseButton>
                        <BaseButton
                            outlined
                            @click="goToPricing"
                        >
                            Acheter le livre
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <NavBar/>
    <TableOfContents/>
    <Author/>
    <FreeSample/>
    <BookPricing/>

    <Footer/>
</template>
<script lang="ts">
import {useBookStore} from "~/stores/bookStore";
import BaseButton from "~/components/ui/buttons/BaseButton.vue";
import NavBar from "~/components/layout/NavBar.vue";
import TableOfContents from "~/components/landing/TableOfContents.vue";
import Author from "~/components/landing/Author.vue";
import Footer from "~/components/layout/Footer.vue";
import BookPricing from "~/components/landing/BookPricing.vue";
import FreeSample from "~/components/ui/content/FreeSample.vue";
import Testimonial from "~/components/ui/content/Testimonial.vue";
import Container from "~/components/ui/content/Container.vue";
import GlassImage from "~/components/ui/GlassImage.vue";

export default {
    components: {
        GlassImage,
        Container,
        Testimonial,
        FreeSample,
        BookPricing,
        Footer,
        Author,
        TableOfContents,
        NavBar,
        BaseButton,
    },
    setup() {
        const bookStore = useBookStore();
        bookStore.fetchImagePages()
        return {
            coverImage: computed(() => bookStore.getImagePageByType('cover')),
            bookImage: computed(() => bookStore.getImagePageByType('back_cover')),
        }
    },
    methods: {
        goToPricing() {
            this.$router.push('#book')
        },
        goToFreeSample() {
            this.$router.push('#free-sample')
        }
    }
}
</script>