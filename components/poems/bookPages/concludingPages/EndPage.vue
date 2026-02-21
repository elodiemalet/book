<template>
    <div
        class="page image-page text-center flex flex-col justify-center overflow-hidden relative">
        <img
            class="m-auto w-full h-full"
            :src="endPage?.url"
            :alt="endPage?.name"
        >
    </div>
</template>

<script lang="ts">

import {useBookStore} from "~/stores/bookStore";

export default {
    name: "EndPage",
    data() {
        const bookStore = useBookStore();
        return {
            endPage: computed(() => bookStore.getImagePageByType('back_cover')),
        };
    },
};

</script>
