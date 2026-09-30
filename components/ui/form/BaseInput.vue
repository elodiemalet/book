<template>
    <div class="flex flex-col gap-1.5">
        <label
            v-if="label"
            :for="inputId"
            class="text-[13px] text-atelier-muted">
            {{ label }}
        </label>
        <div class="grid grid-cols-1">
            <input
                :id="inputId"
                :value="modelValue"
                :type="type"
                :name="name"
                class="col-start-1 row-start-1 block h-11 w-full rounded-md border bg-atelier-panel outline-none px-3 text-[15px] text-atelier-ink placeholder:text-atelier-subtle focus:border-lilas focus:ring-3 focus:ring-lilas-soft focus:outline-none"
                :class="[
                    error ? 'border-danger pr-10' : 'border-atelier-line-strong',
                    serif ? 'font-fraunces text-lg' : '',
                ]"
                :placeholder="placeholder"
                :aria-invalid="error ? true : undefined"
                :aria-describedby="error ? `${inputId}-error` : undefined"
                @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value)"
            >
            <ExclamationCircleIcon
                v-if="error"
                class="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-danger"
                aria-hidden="true"/>
        </div>
        <p
            v-if="error"
            :id="`${inputId}-error`"
            class="text-sm text-danger">{{ error }}</p>
    </div>
</template>

<script lang="ts">

import {ExclamationCircleIcon} from "@heroicons/vue/24/outline";

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
        serif: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    computed: {
        inputId(): string {
            return `field-${this.name}`;
        },
    },
};
</script>
