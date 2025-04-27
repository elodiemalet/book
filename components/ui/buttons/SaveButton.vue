<template>
    <base-button
        class="self-end flex gap-2 items-center justify-center"
    >
        <div>Enregistrer</div>
        <CheckIcon class="w-5 h-5"/>
    </base-button>
</template>
<script setup lang="ts">
import BaseButton from "~/components/ui/buttons/BaseButton.vue";
import {CheckIcon} from "@heroicons/vue/24/outline";
</script>