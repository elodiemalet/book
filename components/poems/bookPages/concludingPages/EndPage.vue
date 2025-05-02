<template>
    <div
        class="page image-page w-a4 h-a4 bg-[#FCFCF9] text-center flex flex-col justify-center overflow-hidden relative">
        <div>
            <img
                :src="endPage?.url"
                :alt="endPage?.name"
                class="m-auto"
            />
        </div>
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
        }
    },
}

</script>