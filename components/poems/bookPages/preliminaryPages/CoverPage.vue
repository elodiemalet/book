<template>
    <div class="w-a4 h-a4 bg-[#FCFCF9] text-center flex flex-col justify-center overflow-hidden relative">
        <div>
            <img
                class="m-auto"
                :src="coverPage?.url"
                :alt="coverPage?.name"
            >
            <div class="absolute bottom-10 left-0 right-0">
                <h3 class="title">{{ author }}</h3>
                <h4 class="title">{{ year }}</h4>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import type {AttachmentEntityInterface} from "~/entities/AttachmentEntity";

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
