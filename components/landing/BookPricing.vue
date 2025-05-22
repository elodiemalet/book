<template>
    <section
        id="book"
        aria-labelledby="pricing-title"
        class="scroll-mt-14 pt-16 pb-8 sm:scroll-mt-32 sm:pt-20 sm:pb-10 lg:pt-32 lg:pb-16"
    >
        <Container>
            <SectionHeading id="pricing-title" :number="4">
                Prix
            </SectionHeading>
            <p class="mt-8 font-display text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                Faites votre choix
            </p>
            <p class="mt-4 max-w-xl text-lg tracking-tight text-slate-600">
                “Ton livre, tes règles” est disponible en deux formules,
                pour que tu puisses choisir celle qui te convient le mieux.
            </p>
        </Container>
        <div class="mx-auto mt-16 max-w-5xl lg:px-6">
            <div class="grid bg-slate-50 sm:px-6 sm:pb-16 md:grid-cols-2 md:rounded-6xl md:px-8 md:pt-16 lg:p-20">
                <PrincingPlan
                    name="E-book"
                    description="Téléchargez la version e-book de “Ton livre, tes règles”."
                    :price="5"
                    href="#"
                    :features="features"
                />
                <PrincingPlan
                    featured
                    name="Livre"
                    description="Recevez chez vous la version imprimée de l’édition complète."
                    :price="29"
                    href="#"
                    :features="featuresFeatured"
                />
            </div>
        </div>
    </section>
</template>
<script lang="ts">
import Container from "~/components/ui/content/Container.vue";
import SectionHeading from "~/components/ui/content/SectionHeading.vue";
import PrincingPlan from "~/components/ui/PrincingPlan.vue";

export default {
    name: "BookPricing",
    components: {PrincingPlan, Container, SectionHeading},
    data() {
        return {
            features: [
                'Téléchargement instantané',
                'Sur tous vos appareils',
                'Lecture sur écran',
            ],
            featuresFeatured: [
                'Livraison à domicile',
                'Emportez-le partout',
                'Confort de lecture papier',
                'À feuilleter, annoter, conserver',
                'Offrir, relire, ou afficher dans sa bibliothèque',
            ],
        };
    }
};
</script>
