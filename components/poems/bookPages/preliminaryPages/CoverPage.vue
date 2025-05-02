<template>
    <div
        class="page image-page w-a4 h-a4 bg-[#FCFCF9] text-center flex flex-col justify-center overflow-hidden relative">
        <div>
            <img
                class="m-auto"
                :src="coverPage?.url"
                :alt="coverPage?.name"
            >
        </div>
    </div>
</template>

<script lang="ts">

import type {AttachmentEntityInterface} from "~/entities/AttachmentEntity";
import {useBookStore} from "~/stores/bookStore";

export default {
    name: "CoverPage",
    data() {
        const bookStore = useBookStore();
        return {
            coverPage: computed(() => bookStore.getImagePageByType('cover')),
            images: [] as AttachmentEntityInterface[],
            author: 'John Doe',
            year: '2019 - 2024',
        }
    },
}

</script>
