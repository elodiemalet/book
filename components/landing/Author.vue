<template>
    <section
        id="auteur"
        aria-labelledby="author-title"
        class="mx-auto grid max-w-7xl scroll-mt-16 grid-cols-1 items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-20 lg:py-32"
    >
        <div class="mx-auto w-full max-w-sm lg:col-span-4 lg:max-w-none">
            <div class="aspect-[4/5] overflow-hidden rounded-[2px] bg-atelier-panel">
                <img
                    v-if="portraitUrl"
                    class="h-full w-full object-cover"
                    :src="portraitUrl"
                    :alt="name ? `Portrait de ${name}` : 'Portrait'"
                    sizes="(min-width: 1024px) 24rem, 20rem"
                >
                <UserIcon
                    v-else
                    class="m-auto h-full w-12 text-atelier-subtle"
                    aria-hidden="true"
                />
            </div>
        </div>
        <div class="flex flex-col gap-6 lg:col-span-7 lg:col-start-6">
            <span class="font-fraunces text-sm text-menthe tabular-nums">{{ number }} — {{ label }}</span>
            <h2
                id="author-title"
                class="font-fraunces text-5xl leading-none font-light tracking-[-0.03em] text-atelier-ink sm:text-6xl"
            >
                {{ name }}
            </h2>
            <p
                v-for="(paragraph, index) in bio"
                :key="index"
                :class="index === 0
                    ? 'font-newsreader text-xl leading-relaxed text-atelier-ink sm:text-[22px]'
                    : 'text-base leading-relaxed text-atelier-muted'"
            >
                {{ paragraph }}
            </p>
            <a
                v-if="link"
                :href="link.href"
                class="flex items-center gap-2 self-start text-[15px] font-medium text-lilas hover:text-lilas-light"
            >
                {{ link.label }}
                <ArrowUpRightIcon
                    class="size-4"
                    aria-hidden="true"
                />
            </a>
        </div>
    </section>
</template>

<script setup lang="ts">
import ArrowUpRightIcon from "@heroicons/vue/24/outline/ArrowUpRightIcon";
import UserIcon from "@heroicons/vue/24/outline/UserIcon";

defineProps<{
    number: string;
    label: string;
    name: string;
    bio: string[];
    portraitUrl?: string | null;
    link?: { label: string; href: string } | null;
}>();
</script>
