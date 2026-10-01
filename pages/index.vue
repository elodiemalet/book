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
                v-if="tocParts.length"
                :number="sectionNumber('sommaire')"
                :heading="content.toc.heading"
                :heading-emphasis="content.toc.headingEmphasis"
                :intro="content.toc.intro"
                :parts="tocParts.slice(0, tocMaxParts)"
                :hidden-count="Math.max(0, tocParts.length - tocMaxParts)"
            />
            <LandingFreeSample
                :number="sectionNumber('extrait')"
                :heading="content.freeSample.heading"
                :heading-emphasis="content.freeSample.headingEmphasis"
                :intro="content.freeSample.intro"
                :note="content.freeSample.note"
                :author="bookAuthor"
            />
            <Author
                :number="sectionNumber('auteur')"
                :label="content.author.label"
                :name="bookAuthor || content.author.label"
                :bio="content.author.bio"
                :portrait-url="content.author.portraitUrl"
                :link="content.author.link"
            />
            <BookPricing
                :number="sectionNumber('livre')"
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
import {landingContent, type LandingContent, type LandingTocPart} from "~/utils/landingContent";
import LandingNav from "~/components/landing/LandingNav.vue";
import LandingHero from "~/components/landing/LandingHero.vue";
import LandingTestimonial from "~/components/landing/LandingTestimonial.vue";
import TableOfContents from "~/components/landing/TableOfContents.vue";
import LandingFreeSample from "~/components/landing/LandingFreeSample.vue";
import Author from "~/components/landing/Author.vue";
import BookPricing from "~/components/landing/BookPricing.vue";
import LandingFooter from "~/components/landing/LandingFooter.vue";

const bookStore = useBookStore();

bookStore.fetchImagePages();
const [, {data: siteContent}] = await Promise.all([
    useAsyncData('landing-book-config', async () => {
        await bookStore.fetchConfig();
        return true;
    }),
    useAsyncData('landing-site-config', () => $fetch<LandingContent>('/api/site-config')),
]);
const content = computed<LandingContent>(() => siteContent.value ?? landingContent);

// Sommaire : les parties du livre (titres et numéros), calculées par le serveur
const {data: tocGroups} = await useAsyncData('landing-toc', () => $fetch<LandingTocPart[]>('/api/book-toc'));
// Sans partie, la section est masquée
const tocParts = computed<LandingTocPart[]>(() => tocGroups.value ?? []);
// Nombre de parties affichées (réglé dans la configuration du livre)
const tocMaxParts = computed(() => Math.max(1, bookStore.config.landingTocMaxParts || 6));

const bookTitle = computed(() => bookStore.config.title || 'Le livre');
const bookAuthor = computed(() => bookStore.config.author || '');
const coverImage = computed(() => bookStore.getImagePageByType('cover'));
const minPrice = computed(() => Math.min(...content.value.pricing.offers.map(offer => offer.price)));

const sections = computed(() => [
    ...(tocParts.value.length ? [{id: 'sommaire', label: 'Sommaire'}] : []),
    {id: 'extrait', label: 'Extrait gratuit'},
    {id: 'auteur', label: content.value.author.label},
    {id: 'livre', label: 'Obtenir le livre'},
]);

// Numéros « 01 », « 02 »… : ils suivent les sections affichées (le sommaire peut être masqué)
const sectionNumber = (id: string) =>
    String(sections.value.findIndex(section => section.id === id) + 1).padStart(2, '0');

useHead({
    title: () => bookAuthor.value ? `${bookTitle.value} — ${bookAuthor.value}` : bookTitle.value,
    htmlAttrs: {lang: 'fr'},
    meta: [
        {name: 'description', content: () => content.value.pitch},
    ],
});
</script>
