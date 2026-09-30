<template>
    <div class="min-h-screen bg-atelier-ground font-instrument text-atelier-ink antialiased [scroll-behavior:smooth] motion-reduce:[scroll-behavior:auto]">
        <LandingNav
            :title="bookTitle"
            :sections="sections"
        />
        <main>
            <LandingHero
                :title="bookTitle"
                :author="bookAuthor"
                :genre="content.genre"
                :pages-label="content.pagesLabel"
                :pitch="content.pitch"
                :cover-url="coverImage?.url"
                :cover-alt="coverImage?.name"
                :min-price="minPrice"
            />
            <LandingTestimonial
                v-if="content.testimonial"
                :testimonial="content.testimonial"
            />
            <TableOfContents
                number="01"
                :heading="content.toc.heading"
                :heading-emphasis="content.toc.headingEmphasis"
                :intro="content.toc.intro"
                :parts="content.toc.parts"
            />
            <LandingFreeSample
                number="02"
                :heading="content.freeSample.heading"
                :heading-emphasis="content.freeSample.headingEmphasis"
                :intro="content.freeSample.intro"
                :note="content.freeSample.note"
                :author="bookAuthor"
            />
            <Author
                number="03"
                :label="content.author.label"
                :name="bookAuthor || content.author.label"
                :bio="content.author.bio"
                :portrait-url="content.author.portraitUrl"
                :link="content.author.link"
            />
            <BookPricing
                number="04"
                :heading="content.pricing.heading"
                :heading-emphasis="content.pricing.headingEmphasis"
                :intro="content.pricing.intro"
                :offers="content.pricing.offers"
            />
        </main>
        <LandingFooter
            :title="bookTitle"
            :copyright="content.footer"
        />
    </div>
</template>

<script setup lang="ts">
import {useBookStore} from "~/stores/bookStore";
import {landingContent} from "~/utils/landingContent";
import LandingNav from "~/components/landing/LandingNav.vue";
import LandingHero from "~/components/landing/LandingHero.vue";
import LandingTestimonial from "~/components/landing/LandingTestimonial.vue";
import TableOfContents from "~/components/landing/TableOfContents.vue";
import LandingFreeSample from "~/components/landing/LandingFreeSample.vue";
import Author from "~/components/landing/Author.vue";
import BookPricing from "~/components/landing/BookPricing.vue";
import LandingFooter from "~/components/landing/LandingFooter.vue";

const content = landingContent;
const bookStore = useBookStore();

bookStore.fetchImagePages();
await useAsyncData('landing-book-config', async () => {
    await bookStore.fetchConfig();
    return true;
});

const bookTitle = computed(() => bookStore.config.title || 'Le livre');
const bookAuthor = computed(() => bookStore.config.author || '');
const coverImage = computed(() => bookStore.getImagePageByType('cover'));
const minPrice = computed(() => Math.min(...content.pricing.offers.map(offer => offer.price)));

const sections = [
    {id: 'sommaire', label: 'Sommaire'},
    {id: 'extrait', label: 'Extrait gratuit'},
    {id: 'auteur', label: content.author.label},
    {id: 'livre', label: 'Obtenir le livre'},
];

useHead({
    title: () => bookAuthor.value ? `${bookTitle.value} — ${bookAuthor.value}` : bookTitle.value,
    htmlAttrs: {lang: 'fr'},
    meta: [
        {name: 'description', content: content.pitch},
    ],
});
</script>
