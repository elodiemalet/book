<template>
    <Teleport to="body">
        <BaseDrawer
            :open="open"
            @close="$emit('close')"
        >
            <template #title>{{ title }}</template>
            <template #description>{{ description }}</template>
            <div
                class="flex flex-col gap-4"
            >
                <BaseDropzone
                    v-model:files="files"
                    class="w-full"
                    :max-size="maxSize"
                    :max-files="maxFiles"
                    :accept="accept"
                />
                <BaseCard v-if="image">
                    <img
                        :src="image.url"
                        alt="Cover page"
                    >
                </BaseCard>
                <SaveButton
                    class="self-end"
                    :disabled="!filesChanged"
                    @click="submit(files, pageType)"
                >
                    Enregistrer
                </SaveButton>
            </div>
        </BaseDrawer>
    </Teleport>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BaseDrawer from "~/components/ui/BaseDrawer.vue";
import BaseDropzone from "~/components/ui/BaseDropzone.vue";
import BaseCard from "~/components/ui/BaseCard.vue";
import type {FileEntityInterface} from "~/entities/FileEntity";
import type {AttachmentEntityInterface} from "~/entities/AttachmentEntity";
import SaveButton from "~/components/ui/buttons/SaveButton.vue";

export default defineComponent({
    name: 'ImportImage',
    components: {SaveButton, BaseCard, BaseDropzone, BaseDrawer},
    props: {
        pageType: {
            type: String,
            default: () => {
                return null;
            },
            validator: (value: string) => {
                return ['cover', 'title', 'copyright', 'dedication_page', 'table_of_contents', 'preface_introduction', 'chapters', 'interlude_boxed_section', 'appendices', 'author_notes', 'index', 'acknowledgments_page', 'publisher_page', 'advertisements_other_books', 'back_cover'].includes(value);
            },
        },
        image: {
            type: Object as PropType<AttachmentEntityInterface | null>,
            default: () => {
                return null;
            },
        },
        open: {
            type: Boolean,
            default: false,
        }
    },
    emits: ['close', 'submit'],
    data() {
        return {
            accept: ['image/jpeg', 'image/png'],
            maxSize: 1024 * 1024 * 10,
            maxFiles: 1,
            title: 'Ajouter une page de couverture',
            description: 'La page de couverture sera affichée en haut de la page de livre',
            files: [] as FileEntityInterface[],
            filesChanged: false,
        };
    },
    watch: {
        files: {
            handler() {
                this.filesChanged = this.files.length > 0;
            },
            deep: true
        },
        open: {
            handler(newValue: boolean) {
                if (!newValue) {
                    this.files = [];
                }
            },
            deep: true
        }
    },
    methods: {
        submit(files: FileEntityInterface[], pageType: string) {
            this.$emit('submit', files, pageType);
        },
    }
});
</script>
