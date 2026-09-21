<template>
    <aside
        :aria-label="`Testimonial from ${author.name}`"
        class="relative bg-slate-100 py-4 sm:py-6"
    >
        <Container
            size="xs"
            class="relative">
            <figure>
                <div class="flex text-yellow-500 ">
                    <StarRating/>
                </div>
                <blockquote
                    class="mt-4 font-display text-3xl font-medium tracking-tight text-slate-900">
                    <slot/>
                </blockquote>
                <figcaption class="mt-4 flex items-center ">
                    <div class="overflow-hidden rounded-full bg-slate-200">
                        <img
                            v-if="author.image"
                            class="h-12 w-12 object-cover"
                            :src="author.image"
                            alt=""
                            width="48"
                            height="48"
                        >
                    </div>
                    <div class="ml-4">
                        <span class="text-base/6 font-medium tracking-tight text-cyan-700">
                            {{ author.name }}
                            - </span>
                        <span class="mt-1 text-sm text-slate-600">{{ author.role }}</span>
                    </div>
                </figcaption>
            </figure>
        </Container>
    </aside>
</template>
<script lang="ts">
import Container from "~/components/ui/content/Container.vue";
import StarRating from "~/components/ui/content/StarRating.vue";

export default {
    name: "Testimonial",
    components: {
        StarRating,
        Container,
    },
    props: {
        author: {
            type: Object,
            required: true,
        },
    },
};
</script>
