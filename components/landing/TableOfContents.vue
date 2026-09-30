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

        <div class="lg:col-span-7 lg:col-start-6">
            <div
                v-for="(part, partIndex) in parts"
                :key="part.title"
                class="border-t border-atelier-line last:border-b"
            >
                <h3>
                    <button
                        type="button"
                        class="flex w-full items-baseline gap-5 rounded-md px-3 py-5 text-left transition-colors duration-150 hover:bg-atelier-hover"
                        :aria-expanded="isOpen(partIndex)"
                        :aria-controls="`sommaire-partie-${partIndex}`"
                        @click="toggle(partIndex)"
                    >
                        <span class="w-9 shrink-0 font-fraunces text-[15px] text-menthe">{{ toRoman(partIndex + 1) }}</span>
                        <span class="flex-1 font-fraunces text-2xl font-normal text-atelier-ink italic sm:text-[28px]">{{ part.title }}</span>
                        <span class="text-sm text-atelier-muted tabular-nums">{{ part.items.length }} textes</span>
                        <ChevronDownIcon
                            class="size-4 self-center text-atelier-subtle transition-transform duration-200 ease-atelier motion-reduce:transition-none"
                            :class="{ 'rotate-180': isOpen(partIndex) }"
                            aria-hidden="true"
                        />
                    </button>
                </h3>
                <ol
                    v-show="isOpen(partIndex)"
                    :id="`sommaire-partie-${partIndex}`"
                    class="flex flex-col gap-1 pr-3 pb-6 pl-3 sm:pl-[68px]"
                >
                    <li
                        v-for="item in part.items"
                        :key="item.title"
                        class="flex items-baseline gap-3 py-1 font-newsreader text-lg text-atelier-ink"
                    >
                        <span>{{ item.title }}</span>
                        <span
                            v-if="item.kind"
                            class="font-instrument text-[11px] tracking-wide"
                            :class="item.kind === 'poème' ? 'text-menthe' : 'text-lilas'"
                        >{{ item.kind }}</span>
                        <span
                            class="flex-1 -translate-y-1 border-b border-dotted border-atelier-line-strong"
                            aria-hidden="true"
                        />
                        <span class="text-base text-atelier-muted tabular-nums">
                            <span class="sr-only">page </span>{{ item.page }}
                        </span>
                    </li>
                </ol>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import ChevronDownIcon from "@heroicons/vue/24/outline/ChevronDownIcon";
import type {LandingTocPart} from "~/utils/landingContent";

defineProps<{
    number: string;
    heading: string;
    headingEmphasis: string;
    intro: string;
    parts: LandingTocPart[];
}>();

const openParts = ref(new Set<number>([0]));

const isOpen = (index: number) => openParts.value.has(index);

const toggle = (index: number) => {
    const next = new Set(openParts.value);
    if (next.has(index)) {
        next.delete(index);
    } else {
        next.add(index);
    }
    openParts.value = next;
};

const toRoman = (value: number) => {
    const numerals: [number, string][] = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    let rest = value;
    let result = '';
    for (const [amount, numeral] of numerals) {
        while (rest >= amount) {
            result += numeral;
            rest -= amount;
        }
    }
    return result;
};
</script>
