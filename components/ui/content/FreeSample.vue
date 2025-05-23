<template>
    <section
        id="free-sample"
        aria-label="Free preview"
        class="scroll-mt-14 bg-cyan-600 sm:scroll-mt-32"
    >
        <div class="overflow-hidden relative">
            <GlassImage/>
            <Container
                size="md"
                class="z-20 relative grid grid-cols-1 items-end gap-y-12 py-20 lg:static lg:grid-cols-2 lg:py-28 xl:py-32"
            >
                <!--                <Pattern class="absolute -top-32 left-0 w-full sm:-top-5 sm:left-3/4 sm:ml-8 sm:w-auto md:left-2/3 lg:right-2 lg:left-auto lg:ml-0 xl:right-auto xl:left-2/3"/>-->
                <div class="z-20">
                    <h2 class="font-display text-5xl font-extrabold tracking-tight text-white sm:w-3/4 sm:text-6xl md:w-2/3 lg:w-auto">
                        Obtenez votre extrait gratuit
                    </h2>
                    <p class="mt-4 text-lg tracking-tight text-white">
                        Entrez votre adresse e-mail et je vous enverrai un extrait du livre
                        contenant deux de mes chapitres préférés.
                    </p>
                </div>
                <form class="lg:pl-16 z-20">
                    <h3 class="text-base font-medium tracking-tight text-white">
                        Recevoir un extrait gratuit dans votre boîte mail
                        <span aria-hidden="true">&rarr;</span>
                    </h3>
                    <div class="mt-4 sm:relative sm:flex sm:items-center sm:py-0.5 sm:pr-2.5">
                        <div class="relative sm:static sm:flex-auto">
                            <input
                                v-model="email"
                                type="email"
                                required
                                aria-label="Email address"
                                placeholder="Email address"
                                class="peer relative z-10 w-full appearance-none bg-transparent px-4 py-2 text-base text-white placeholder:text-white/70 focus:outline-hidden sm:py-3"
                            >
                            <div
                                class="absolute inset-0 rounded-md border border-white/20 peer-focus:border-cyan-300 peer-focus:bg-cyan-500 peer-focus:ring-1 peer-focus:ring-cyan-300 sm:rounded-xl"/>
                        </div>
                        <BaseButton
                            outlined
                            class="mt-4 w-full sm:relative sm:z-10 sm:mt-0 sm:w-auto sm:flex-none"
                            @click="submit"
                        >
                            Obtenir mon extrait
                        </BaseButton>
                    </div>
                </form>
            </Container>
        </div>
    </section>
</template>
<script lang="ts">
import BaseButton from "~/components/ui/buttons/BaseButton.vue";
import Container from "~/components/ui/content/Container.vue";
import GlassImage from "~/components/ui/GlassImage.vue";

export default {
    name: "FreeSample",
    components: {GlassImage, BaseButton, Container},
    setup() {
        const toast = useToast();
        return {
            toast
        };
    },
    data() {
        return {
            email: '',
        };
    },
    methods: {
        async submit() {
            const {error} = await useFetch('/api/prospect', {
                method: 'POST',
                body: JSON.stringify({email: this.email}),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (error.value) {
                this.toast.add({
                    id: 'error',
                    icon: 'i-material-symbols-file-download-off',
                    title: 'Une erreur est survenue',
                    color: 'red',

                });
                return;
            }

            this.toast.add({
                id: 'success',
                icon: 'i-material-symbols-file-download-off',
                title: 'Prospect créé avec succès',
            });
        },
    }
};
</script>
