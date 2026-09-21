<template>
    <li>
        <h3 class="font-display text-3xl font-bold tracking-tight text-slate-900">
            {{ title }}
        </h3>
        <ol
            role="list"
            class="mt-8 divide-y divide-slate-300/30 rounded-2xl bg-slate-50 px-6 py-3 text-base tracking-tight sm:px-8 sm:py-7"
        >
            <li
                v-for="(pageNumber, pageTitle) in pages"
                :key='pageNumber'
                class="flex justify-between py-3"
                :aria-label="`${pageTitle} on page ${pageNumber}`"
            >
                <span
                    class="font-medium text-slate-900"
                    aria-hidden="true"
                >
                    {{ pageTitle }}
                </span>
                <span
                    class="font-mono text-slate-400"
                    aria-hidden="true"
                >
                    {{ pageNumber }}
                </span>
            </li>
        </ol>
    </li>
</template>

<script lang="ts">

export default defineComponent({
    name: 'ExpandableItem',
    props: {
        title: {
            type: String,
            required: true
        },
        pages: {
            type: Object,
            required: true
        }
    }
});

</script>
