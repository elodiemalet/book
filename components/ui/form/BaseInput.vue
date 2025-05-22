<template>
    <div class="relative">
        <label
            v-if="label"
            :for="name"
            class="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900">
            {{ label }}
        </label>
        <div class="mt-2 grid grid-cols-1">
            <input
                :value="modelValue"
                :type="type"
                :name="name"
                class="col-start-1 row-start-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                :class="{'outline-red-600 text-red-900 ': error}"
                :placeholder="placeholder"
                @input="$emit('update:modelValue', $event.target?.value)"
            >
            <ExclamationCircleIcon
                v-if="error"
                class="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4"
                aria-hidden="true"/>
        </div>
        <p
            v-if="error"
            class="mt-1 text-sm text-red-600">{{ error }}</p>
    </div>
</template>

<script lang="ts">

import {ExclamationCircleIcon} from "@heroicons/vue/24/solid";

export default {
    name: "BaseInput",
    components: {ExclamationCircleIcon},
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: 'text',
        },
        label: {
            type: String,
            default: '',
        },
        placeholder: {
            type: String,
            default: '',
        },
        error: {
            type: String,
            default: '',
        },
    },
    emits: ['update:modelValue']
};
</script>
