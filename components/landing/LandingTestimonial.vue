<template>
    <aside
        :aria-label="`Avis de ${testimonial.name}`"
        class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20"
    >
        <div class="grid grid-cols-1 items-center gap-6 border-y border-atelier-line py-12 lg:grid-cols-12">
            <span
                class="font-fraunces text-8xl leading-[0.6] text-menthe lg:col-span-1"
                aria-hidden="true"
            >“</span>
            <figure class="lg:col-span-8">
                <blockquote class="font-newsreader text-2xl leading-snug text-atelier-ink italic sm:text-[28px]">
                    {{ testimonial.quote }}
                </blockquote>
                <figcaption class="mt-4 text-sm text-atelier-muted">
                    {{ testimonial.name }}<template v-if="testimonial.role"> · <span class="text-atelier-subtle">{{ testimonial.role }}</span></template>
                </figcaption>
            </figure>
            <div
                v-if="testimonial.rating"
                class="flex gap-1 text-menthe lg:col-span-3 lg:justify-end"
                role="img"
                :aria-label="`Note : ${testimonial.rating} sur 5`"
            >
                <StarIcon
                    v-for="index in testimonial.rating"
                    :key="index"
                    class="size-4.5"
                    aria-hidden="true"
                />
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
import StarIcon from "@heroicons/vue/24/solid/StarIcon";
import type {LandingTestimonial} from "~/utils/landingContent";

defineProps<{
    testimonial: LandingTestimonial;
}>();
</script>
