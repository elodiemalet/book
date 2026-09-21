<template>
    <BaseButton
    >
        <div class="flex items-center gap-x-2">
            <div>Enregistrer</div>
            <CheckIcon class="w-5 h-5"/>
        </div>
    </BaseButton>
</template>
<script setup lang="ts">
import BaseButton from "~/components/ui/buttons/BaseButton.vue";
import {CheckIcon} from "@heroicons/vue/24/outline";
</script>
