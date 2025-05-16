<template>
    <div class="flex gap-1">
        <StarIcon
            v-for="index in rating"
            :key="index"
            class="h-5 w-5 fill-current"
        />
    </div>
</template>

<script lang="ts">
import StarIcon from "@heroicons/vue/24/outline/StarIcon";

export default {
    name: "StarRating",
    components: {
        StarIcon,
    },
    props: {
        rating: {
            type: Number,
            default: 5,
        },
    },
}
</script>