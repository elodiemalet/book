<template>
    <section
        id="sommaire"
        aria-labelledby="sommaire-title"
        class="mx-auto grid max-w-7xl scroll-mt-16 grid-cols-1 gap-12 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-20 lg:py-32"
    >
        <div class="flex flex-col gap-5 lg:col-span-4">
            <span class="font-fraunces text-sm text-menthe tabular-nums">{{ number }} — Sommaire</span>
            <h2
                id="sommaire-title"
                class="font-fraunces text-4xl leading-[1.05] font-normal tracking-tight text-atelier-ink sm:text-5xl"
            >
                {{ heading }} <em class="italic">{{ headingEmphasis }}</em>
            </h2>
            <p class="text-base leading-relaxed text-atelier-muted">
                {{ intro }}
            </p>
        </div>

        <!-- Uniquement les titres des parties, sans leurs textes -->
        <div class="lg:col-span-7 lg:col-start-6">
            <ol class="border-b border-atelier-line">
                <li
                    v-for="part in parts"
                    :key="part.numeral"
                    class="flex items-baseline gap-5 border-t border-atelier-line px-3 py-5"
                >
                    <span class="w-9 shrink-0 font-fraunces text-[15px] text-menthe">{{ part.numeral }}</span>
                    <span class="flex-1 font-fraunces text-2xl font-normal text-atelier-ink italic sm:text-[28px]">{{ part.title }}</span>
                </li>
            </ol>
            <p
                v-if="hiddenCount > 0"
                class="px-3 pt-5 font-newsreader text-lg text-atelier-muted italic"
            >
                … et {{ hiddenCount }} autre{{ hiddenCount > 1 ? 's' : '' }} partie{{ hiddenCount > 1 ? 's' : '' }} à découvrir dans le livre.
            </p>
        </div>
    </section>
</template>

<script setup lang="ts">
import type {LandingTocPart} from "~/utils/landingContent";

withDefaults(defineProps<{
    number: string;
    heading: string;
    headingEmphasis: string;
    intro: string;
    parts: LandingTocPart[];
    // Parties du livre non affichées (au-delà de la limite)
    hiddenCount?: number;
}>(), {hiddenCount: 0});
</script>
