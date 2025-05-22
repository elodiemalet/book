<template>
    <section
        id="table-of-contents"
        aria-labelledby="table-of-contents-title"
        class="scroll-mt-14 py-16 sm:scroll-mt-32 sm:py-20 lg:py-32"
    >
        <Container>
            <SectionHeading id="table-of-contents-title" :number="1">
                Table des matières
            </SectionHeading>
            <p class="mt-8 font-display text-4xl font-bold tracking-tight text-slate-900">
                Parcourez tout le contenu que vous avez importé et structuré. Votre e-book rassemble tout ce qui compte
                pour vous, au même endroit.
            </p>
            <p class="mt-4 text-lg tracking-tight text-slate-700">
                “Ton livre, tes règles” se compose de pages soigneusement mises en forme, pensées pour s’adapter à votre
                style de contenu — qu’il soit professionnel, personnel ou artistique.
                Pas de distraction, juste l’essentiel, mis en valeur.
            </p>
            <Expandable
                :table-of-contents="tableOfContents"
            />
        </Container>
    </section>
</template>
<script lang="ts">
import Container from "~/components/ui/content/Container.vue";
import SectionHeading from "~/components/ui/content/SectionHeading.vue";
import Expandable from "~/components/ui/expandable/Expandable.vue";

export default defineComponent({
    name: 'TableOfContents',
    components: {Expandable, Container, SectionHeading},
    setup() {
        const tableOfContents = {
            "Commencer": {
                "Introduction au projet": 1,
                "Présentation des objectifs": 5,
                "Premiers éléments de contenu": 10
            },
            "Fondamentaux": {
                "Organisation du texte": 14,
                "Structuration des idées": 18,
                "Hiérarchisation de l'information": 23,
                "Rythme et fluidité de lecture": 28
            },
            "Enrichir le contenu": {
                "Ajout de visuels ou illustrations": 34,
                "Séparer pour mieux raconter": 39,
                "Créer des respirations dans le texte": 45,
                "Personnaliser le ton": 52
            },
            "Préparer la version finale": {
                "Relire et ajuster": 58,
                "Définir le sommaire": 64,
                "Exporter votre e-book": 70
            }
        };

        return {
            tableOfContents
        };
    }
});

</script>
