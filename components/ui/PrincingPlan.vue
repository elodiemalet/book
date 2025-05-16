<template>
    <div
        :class="[
            'relative px-4 py-16 sm:rounded-3xl sm:px-10 md:py-12 lg:px-12 overflow-hidden',
            featured && !bookImage && 'bg-blue-600 sm:shadow-lg',
            featured && bookImage && 'bg-slate-800 sm:shadow-lg',
        ]"
    >
        <div v-if="featured"
             class="absolute inset-0 mask-[linear-gradient(white,transparent)] text-white/10">
            <GlassImage/>
        </div>
        <div class="relative flex flex-col z-10">
            <h3
                :class="[
                    'mt-7 text-lg font-semibold tracking-tight',
                    featured ? 'text-white' : 'text-slate-900',
                ]"
            >
                {{ name }}
            </h3>
            <p
                :class="[
            'mt-2 text-lg tracking-tight',
            featured ? 'text-white' : 'text-slate-600',
            ]"
            >
                {{ description }}
            </p>
            <p class="order-first flex font-display font-bold">
          <span
              :class="[
                'text-[1.75rem]/9',
                featured ? 'text-white' : 'text-slate-500',
              ]"
          >
              {{ price ? '€' : '' }}
            </span>
                <span
                    :class="[
                        'mt-1 ml-1 text-7xl tracking-tight',
                        featured ? 'text-white' : 'text-slate-900',
                    ]"
                >
            {{ price ? price : 'Gratuit' }}
            </span>
            </p>
            <div class="order-last mt-8">
                <ul
                    role="list"
                    :class="[
            '-my-2 divide-y text-base tracking-tight',
            featured
            ? 'divide-white/10 text-white'
            : 'divide-slate-200 text-slate-900',
            ]"
                >
                    <li
                        v-for="feature in features"
                        :key="feature" class="flex py-2">
                        <CheckIcon
                            :class="[
                        'h-8 w-8 flex-none',
                        featured ? 'fill-white' : 'fill-slate-600',
                        ]"
                        />
                        <span class="ml-4">{{ feature }}</span>
                    </li>
                </ul>
            </div>
            <BaseButton
                :outlined="featured"
                @click="goTo(href)"
                class="mt-8"
                :aria-label="`Get started with the ${name} plan for $${price}`"
            >
                Commencer
            </BaseButton>
        </div>
    </div>
</template>
<script lang="ts">
import GridPattern from "~/components/ui/pattern/GridPattern.vue";
import BaseButton from "~/components/ui/buttons/BaseButton.vue";
import CheckIcon from "@heroicons/vue/24/outline/CheckIcon";
import GlassImage from "~/components/ui/GlassImage.vue";

export default {
    name: "PrincingPlan",
    components: {GlassImage, BaseButton, GridPattern, CheckIcon},
    props: {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        features: {
            type: Array as PropType<string[]>,
            required: true,
        },
        href: {
            type: String,
            required: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        goTo(href: string) {
            this.$router.push(href)
        }
    }
}
</script>