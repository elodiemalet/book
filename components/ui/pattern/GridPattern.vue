<template>
    <svg aria-hidden="true" class="absolute inset-0 h-full w-full">
        <defs>
            <pattern
                :id="patternId"
                :width="width"
                :height="height"
                :patternUnits="patternUnits"
                v-bind="$attrs"
            >
                <path d="M0 128V.5H128" fill="none" stroke="currentColor"/>
            </pattern>
        </defs>
        <rect width="100%" height="100%" :fill="`url(#${patternId})`"/>
    </svg>

</template>

<script setup lang="ts">
import {ref} from 'vue'

// define the props you want to expose (omit 'id')
const props = defineProps({
    width: {
        type: [Number, String],
        default: 128,
    },
    height: {
        type: [Number, String],
        default: 128,
    },
    patternUnits: {
        type: String,
        default: 'userSpaceOnUse',
    },
})

// generate a unique id per component instance
const patternId = ref('pattern-' + Math.random().toString(36).slice(2, 9))

// expose props to template
const {width, height, patternUnits} = toRefs(props)
</script>
