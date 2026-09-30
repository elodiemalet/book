<template>
    <section
        id="livre"
        aria-labelledby="pricing-title"
        class="scroll-mt-16 border-t border-atelier-line bg-atelier-panel"
    >
        <div class="mx-auto flex max-w-7xl flex-col gap-14 px-5 py-24 sm:px-8 lg:px-20 lg:py-32">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-10">
                <div class="flex flex-1 flex-col gap-5">
                    <span class="font-fraunces text-sm text-menthe tabular-nums">{{ number }} — Obtenir le livre</span>
                    <h2
                        id="pricing-title"
                        class="font-fraunces text-4xl leading-none font-normal tracking-tight text-atelier-ink sm:text-[56px]"
                    >
                        {{ heading }} <em class="italic">{{ headingEmphasis }}</em>
                    </h2>
                </div>
                <p class="max-w-md text-base leading-relaxed text-atelier-muted">
                    {{ intro }}
                </p>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <article
                    v-for="offer in offers"
                    :key="offer.id"
                    :aria-labelledby="`offer-${offer.id}`"
                    class="flex flex-col gap-6 rounded-[10px] border p-8 sm:p-10"
                    :class="offer.featured ? 'border-lilas bg-lilas-tint' : 'border-atelier-line bg-atelier-ground'"
                >
                    <div class="flex items-baseline justify-between gap-4">
                        <h3
                            :id="`offer-${offer.id}`"
                            class="text-xl font-semibold text-atelier-ink"
                        >
                            {{ offer.name }}
                        </h3>
                        <span
                            v-if="offer.badge"
                            class="rounded bg-lilas px-2.5 py-1 text-xs font-semibold text-atelier-panel"
                        >{{ offer.badge }}</span>
                        <span
                            v-else
                            class="text-sm text-atelier-muted"
                        >{{ offer.format }}</span>
                    </div>
                    <p class="flex items-start gap-1 font-fraunces text-atelier-ink">
                        <span class="text-[88px] leading-[0.9] font-light tracking-[-0.03em] tabular-nums">{{ offer.price }}</span>
                        <span class="mt-1.5 text-3xl text-atelier-muted">€</span>
                    </p>
                    <p :class="offer.featured ? 'text-[#c3c6d3]' : 'text-atelier-muted'">
                        {{ offer.description }}
                    </p>
                    <ul
                        role="list"
                        class="flex flex-col text-[15px] text-atelier-ink"
                    >
                        <li
                            v-for="feature in offer.features"
                            :key="feature"
                            class="flex gap-3 border-t py-3 last:border-b"
                            :class="offer.featured ? 'border-[#454275]' : 'border-atelier-line'"
                        >
                            <CheckIcon
                                class="size-4.5 shrink-0"
                                :class="offer.featured ? 'text-lilas' : 'text-menthe'"
                                aria-hidden="true"
                            />
                            {{ feature }}
                        </li>
                    </ul>
                    <span class="flex-1"/>
                    <a
                        :href="offer.href"
                        class="flex h-12.5 items-center justify-center rounded-md text-[15px] font-semibold transition-colors duration-150"
                        :class="offer.featured
                            ? 'bg-lilas text-atelier-panel hover:bg-lilas-light'
                            : 'border border-atelier-line-strong text-atelier-ink hover:border-atelier-subtle hover:bg-atelier-hover'"
                        :aria-label="`${offer.cta} — ${offer.price} €`"
                    >
                        {{ offer.cta }}
                    </a>
                </article>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import CheckIcon from "@heroicons/vue/24/outline/CheckIcon";
import type {LandingOffer} from "~/utils/landingContent";

defineProps<{
    number: string;
    heading: string;
    headingEmphasis: string;
    intro: string;
    offers: LandingOffer[];
}>();
</script>
