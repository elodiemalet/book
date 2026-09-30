<template>
    <div
        class="relative aspect-[148/210] w-full overflow-hidden rounded-[2px] bg-page text-page-ink shadow-page"
        role="img"
        :aria-label="`Couverture du livre ${title}`"
    >
        <img
            v-if="imageUrl"
            class="absolute inset-0 h-full w-full object-cover"
            :src="imageUrl"
            :alt="imageAlt || ''"
        >
        <div
            v-else
            class="flex h-full flex-col px-[11%] pt-[15%] pb-[11%]"
        >
            <span
                v-if="author"
                class="font-newsreader text-[0.7rem] tracking-[0.26em] text-page-muted uppercase"
            >{{ author }}</span>
            <span class="mt-[20%] font-fraunces text-[clamp(1.75rem,3.2vw,2.9rem)] leading-none tracking-tight">
                {{ title }}
            </span>
            <span class="flex-1"/>
            <span class="font-newsreader text-sm text-page-muted italic">{{ genre }}</span>
        </div>
        <span
            class="pointer-events-none absolute inset-y-0 left-0 w-3.5 bg-linear-to-r from-page-ink/12 to-transparent"
            aria-hidden="true"
        />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
    author?: string;
    genre?: string;
    imageUrl?: string | null;
    imageAlt?: string | null;
}>();
</script>
