<template>
    <section
        id="author"
        aria-labelledby="author-title"
        class="relative scroll-mt-14 pt-8 pb-3 sm:scroll-mt-32 sm:pt-10 sm:pb-16 lg:pt-16"
    >
        <div class="relative mx-auto max-w-5xl pt-16 sm:px-6">
            <div class="bg-slate-50 pt-px sm:rounded-6xl">
                <div
                    class="relative mx-auto -mt-16 h-44 w-44 overflow-hidden rounded-full bg-slate-200 md:float-right md:h-64 md:w-64 md:[shape-outside:circle(40%)] lg:mr-20 lg:h-72 lg:w-72">
                    <img
                        class="absolute inset-0 h-full w-full object-cover"
                        :src="authorImage"
                        :alt="authorImageAlt"
                        sizes="(min-width: 1024px) 18rem, (min-width: 768px) 16rem, 11rem"
                    >
                </div>
                <div class="px-4 py-10 sm:px-10 sm:py-16 md:py-20 lg:px-20 lg:py-32">
                    <SectionHeading
                        id="author-title"
                        :number="5">
                        Author
                    </SectionHeading>
                    <p class="mt-8 font-display text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                        <span class="block text-cyan-600">Elodie Malet –</span> Développeuse freelance fullstack &
                        créatrice d’outils web sur mesure.
                    </p>
                    <p class="mt-4 text-lg tracking-tight text-slate-700">
                        Je conçois des applis et des solutions digitales claires, efficaces, et pensées pour répondre à
                        de vrais besoins métiers.
                        Mon approche est directe, autonome, et orientée terrain : j’aime quand les projets avancent et
                        qu’ils font une vraie différence côté utilisateur.
                        Je m’implique aussi bien dans la technique que dans la logique métier, avec une vision globale
                        du produit.
                    </p>
                    <p class="mt-8 text-slate-700">
                        <span
                            class="inline-flex items-center text-base font-medium tracking-tight"
                        >
                            <span class="ml-4">👉 Tu as un projet en tête, même flou ? Parlons-en.</span>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>
<script lang="ts">
import SectionHeading from "~/components/ui/content/SectionHeading.vue";

export default defineComponent({
    name: 'Author',
    components: {SectionHeading},
    setup() {
        const authorImage = '/images/avatars/author.png';
        const authorImageAlt = computed(() => 'Author image');
        return {
            authorImage,
            authorImageAlt
        };
    }
});
</script>
