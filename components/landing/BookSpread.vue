<template>
    <!-- Double page décorative : évoque l'extrait sans reproduire de texte -->
    <div
        class="flex shadow-page"
        aria-hidden="true"
    >
        <div class="relative flex aspect-[148/210] w-[min(42vw,330px)] flex-col bg-page px-[11%] pt-[11%] pb-[12%]">
            <span class="self-center font-newsreader text-[0.45rem] tracking-[0.2em] text-page-muted uppercase">{{ author }}</span>
            <span class="mt-[22%] mb-[8%] h-1.5 w-2/5 bg-page-ink/80"/>
            <span
                v-for="(width, index) in versesLeft"
                :key="`l-${index}`"
                class="mb-[3.2%] h-[3px] rounded-full bg-page-ink/15"
                :class="{ 'mt-[5%]': width === 0 }"
                :style="{ width: `${width}%`, marginLeft: index > 4 && index < 9 ? '14%' : undefined }"
            />
            <span class="absolute inset-x-0 bottom-[5%] text-center font-newsreader text-[0.55rem] text-page-ink">14</span>
            <span class="absolute inset-y-0 right-0 w-6 bg-linear-to-l from-page-ink/7 to-transparent"/>
        </div>
        <div class="relative flex aspect-[148/210] w-[min(42vw,330px)] flex-col bg-page px-[11%] pt-[11%] pb-[12%]">
            <span class="mt-[16%] text-[0.5rem] tracking-[0.24em] text-page-muted">II</span>
            <span class="mt-[3%] h-2 w-3/5 bg-page-ink/80"/>
            <span class="my-[7%] h-px w-5 bg-page-ink"/>
            <span
                v-for="index in 13"
                :key="`r-${index}`"
                class="mb-[3.2%] h-[3px] rounded-full bg-page-ink/15"
                :style="{ width: index === 13 ? '55%' : '100%' }"
            />
            <span class="absolute inset-x-0 bottom-[5%] text-center font-newsreader text-[0.55rem] text-page-ink">15</span>
            <span class="absolute inset-y-0 left-0 w-6 bg-linear-to-r from-page-ink/7 to-transparent"/>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    author?: string;
}>();

const versesLeft = [62, 48, 56, 40, 0, 30, 52, 44, 50, 0, 46, 58, 38];
</script>
