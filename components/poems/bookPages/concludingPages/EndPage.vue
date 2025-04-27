<template>
    <div
        class="page image-page w-a4 h-a4 bg-[#FCFCF9] text-center flex flex-col justify-center overflow-hidden relative">
        <div>
            <img
                :src="endPage?.url"
                :alt="endPage?.name"
                class="m-auto"
            />
        </div>

        <div class="absolute bottom-0 left-0 right-0 glass-effect bg-opacity-10 p-10">

            <div class="h-3/5">
                <h2 class="title whitespace mb-10">
                    Laissez-vous emporter par les mots...
                </h2>

                <p class="mt-2">
                    Plongez au cœur de ce recueil de poèmes, conçu comme une exploration sincère des profondeurs
                    de l’âme et des nuances du quotidien.
                </p>

                <p class="mt-2">
                    À travers des vers épurés, l’auteur nous livre ses pensées intimes, ses émotions délicates et ses
                    instants de rêverie. Entre beauté et mélancolie, chaque poème met en lumière les détails qui
                    façonnent
                    notre humanité.

                </p>

                <p class="mt-2">
                    Laissez-vous guider par ces mots qui invitent à la réflexion et à la contemplation, dans un voyage
                    intérieur où chaque page résonne comme une invitation à la sensibilité et à la découverte.
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

export default {
    name: "EndPage",
    data() {
        const bookStore = useBookStore();
        return {
            endPage: computed(() => bookStore.getImagePageByType('back_cover')),
        }
    },
}

</script>

export default {
name: "EndPage",
data() {
const bookStore = useBookStore();
return {
coverPage: computed(() => bookStore.getImagePageByType('cover')),
}
},
}

<style scoped>

</style>