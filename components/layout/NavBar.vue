<template>
    <div class="sticky top-0 z-50">
        <div
            class="hidden sm:flex sm:h-32 sm:justify-center sm:border-b sm:border-slate-200 sm:bg-white/95 sm:[@supports(backdrop-filter:blur(0))]:bg-white/80 sm:[@supports(backdrop-filter:blur(0))]:backdrop-blur-sm">
            <ol
                role="list"
                class="mb-[-2px] grid auto-cols-[minmax(0,15rem)] grid-flow-col text-base font-medium text-slate-900 [counter-reset:section]"
            >

                <li
                    v-for="(section, sectionIndex) in sections"
                    :key="section.id"
                    class="flex [counter-increment:section] cursor-pointer"
                >
                    <a
                        class="flex w-full flex-col items-center justify-center border-b-2 before:mb-2 before:font-mono before:text-sm before:content-[counter(section,decimal-leading-zero)]"
                        :class="sectionIndex === activeIndex ? 'border-cyan-600 bg-white text-cyan-600 before:text-cyan-600' : 'border-transparent before:text-slate-500 hover:bg-white hover:before:text-slate-900'"
                        @click.prevent="goToSection(section.id)"
                    >
                        {{ section.title }}
                    </a>
                </li>
            </ol>
        </div>
    </div>
</template>

<script lang="ts">

export default defineComponent({
    name: 'NavBar',
    data() {
        return {
            sections: [
                {
                    id: 'table-of-contents',
                    title: 'Table des matières',
                },
                {id: 'author', title: 'Auteur'},
                {id: 'book', title: 'Obtenir un livre'},
            ],
        };
    },
    computed: {
        activeIndex() {
            return this.$route.hash.slice(1);
        },
    },
    methods: {
        goToSection(id: string) {
            this.$router.push(`#${id}`);
        }
    }
});
</script>
