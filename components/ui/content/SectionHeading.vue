<template>
    <h2
        class="inline-flex items-center rounded-full px-4 py-1 text-cyan-600 ring-1 ring-cyan-600 ring-inset"
    >
        <span class="font-mono text-sm" aria-hidden="true">
            {{ numberPadStart }}
        </span>
        <span class="ml-3 h-3.5 w-px bg-cyan-600/20"/>
        <span class="ml-3 text-base font-medium tracking-tight">
            <slot/>
        </span>
    </h2>
</template>
<script lang="ts">

export default defineComponent({
    name: 'SectionHeading',
    props: {
        number: {
            type: Number,
            required: true
        },
    },
    computed: {
        numberPadStart() {
            return this.number.toString().padStart(2, '0');
        }
    }
});
</script>
