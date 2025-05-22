<template>
    <div class="flex justify-between w-full gap-4 border-t border-gray-200">
        <div class="pagination-item">
            <div @click="prevPage">Previous</div>
        </div>
        <div class="flex gap-4 ">
            <div
                v-for="(pageNumber, index) in paginationPages"
                :key="index"
                class="pagination-item"
                :class="pageNumber === page ? 'selected' : ''"
                @click="$emit('page', pageNumber)"
            >
                {{ pageNumber }}
            </div>
        </div>
        <div class="pagination-item">
            <div @click="nextPage">Next</div>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    props: {
        page: {
            type: Number,
            required: true
        },
        countPage: {
            type: Number,
            required: true
        },
        limit: {
            type: Number,
            default: 10,
        }
    },
    emits: ['prevPage', 'nextPage', 'page'],
    computed: {
        paginationPages() {
            const pages = [];
            for (let i = 1; i <= this.countPage; i++) {
                pages.push(i);
            }
            if (pages.length > 6) {
                const firstPages = pages.slice(0, 3);
                const lastPages = pages.slice(-3);
                return [...firstPages, '...', ...lastPages];
            }

            return pages;
        }
    },
    methods: {
        prevPage() {
            if (this.page > 1) {
                this.$emit('prevPage');
            }
        },
        nextPage() {
            if (this.page < this.countPage) {
                this.$emit('nextPage');
            }
        }
    }

});
</script>

<style scoped lang="scss">

.pagination-item {
    @apply border-t border-transparent hover:border-gray-200 cursor-pointer p-3;

    &.selected {
        @apply border-t border-cyan-500 text-cyan-500;
    }

}

</style>
