<template>
    <div class="space-y-8">
        <div>
            <h3 v-if="title"
                class="text-base/7 font-semibold text-gray-900">{{ title }}</h3>
            <p v-if="description"
               class="mt-1 text-sm/6 text-gray-600">{{ description }}</p>
        </div>
        <slot/>
        <div class="mt-2 flex items-center justify-end gap-x-6">
            <CancelButton
                @click="cancel"
            >
                Annuler
            </CancelButton>
            <BaseButton
                @click="submit"
            >
                Sauvegarder
            </BaseButton>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import BaseButton from "~/components/ui/buttons/BaseButton.vue";
import CancelButton from "~/components/ui/buttons/CancelRoundButton.vue";

export default defineComponent({
    name: "BaseForm",
    components: {CancelButton, BaseButton},
    props: {
        title: {
            type: String,
            default: '',
        },
        description: {
            type: String,
            default: '',
        },
    },
    emits: ['cancel', 'submit'],
    methods: {
        cancel() {
            this.$emit('cancel')
        },
        submit() {
            this.$emit('submit')
        },
    }
})
</script>