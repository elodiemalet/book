<template>
    <ol role="list" class="mt-16 space-y-10 sm:space-y-16">
        <ExpandableItem
            v-for="(pages, title) in contents"
            :key="title"
            :title="title"
            :pages="pages"
        />
        <ExpandableButton
            v-if="!showAll"
            @click="showAll = !showAll"
        >Voir plus
        </ExpandableButton>
    </ol>
</template>
<script lang="ts">
import ExpandableItem from "~/components/ui/expandable/ExpandableItem.vue";
import ExpandableButton from "~/components/ui/expandable/ExpandableButton.vue";

export default defineComponent({
    name: 'Expandable',
    components: {ExpandableItem, ExpandableButton},
    props: {
        tableOfContents: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showAll: false
        };
    },
    computed: {
        contents() {
            const contents = Object.entries(this.tableOfContents);
            if (this.showAll) {
                return this.tableOfContents;
            }
            return Object.fromEntries(contents.slice(0, 1));
        },
    }
});
</script>
