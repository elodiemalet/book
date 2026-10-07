<template>
    <div class="page text-left flex flex-col gap-4 relative">
        <div
            v-if="isFirst"
            class="mt-8">
            <h2 class="title text-left pl-10 normal-case">Sommaire</h2>
        </div>
        <ol>
            <li
                v-for="(line, i) in lines"
                :key="`${line.type}-${line.page}`"
                class="flex items-end gap-2"
                :class="{italic: line.type === 'part', 'mt-[1lh]': tocLineHasBlankAbove(line, lines[i - 1])}"
            >
                <span>{{ tocLineLabel(line) }}</span>
                <span
                    class="mb-[0.35em] min-w-4 flex-1 border-b border-dotted border-current opacity-40"
                    aria-hidden="true"/>
                <span class="tabular-nums">{{ line.page }}</span>
            </li>
        </ol>
        <footer>
            {{ page }}
        </footer>
    </div>
</template>

<script lang="ts">
import {defineComponent, type PropType} from 'vue';
import {tocLineHasBlankAbove, tocLineLabel, type TocLine} from '~/utils/bookToc';

export default defineComponent({
    props: {
        lines: {
            type: Array as PropType<TocLine[]>,
            required: true
        },
        // Seule la première page du sommaire porte le titre
        isFirst: {
            type: Boolean,
            default: false
        },
        page: {
            type: Number,
            required: true
        },
    },
    methods: {
        tocLineHasBlankAbove,
        tocLineLabel,
    },
});
</script>
