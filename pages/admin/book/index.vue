<template>
    <NuxtLayout name="admin-page">
        <template #title>Mon livre</template>
        <div class="flex gap-4">
            <BaseCard v-if="coverPage">
                <div class="flex gap-6 items-center justify-center ">
                    <img
                        :src="coverPage.url"
                        alt="Cover page"
                        class="h-16"
                    >
                    <div>Page de couverture</div>
                    <EditRoundButton
                        @click="openModalPage('cover')"
                    />
                </div>
            </BaseCard>
            <ButtonCard
                v-else
                @click="openModalPage('cover')">
                <div class="flex gap-6 items-center justify-center justify-items-center">
                    <div>Ajouter une page de présentation</div>
                    <AddButton/>
                </div>
            </ButtonCard>
            <BaseCard v-if="backCoverPage">
                <div class="flex gap-6 items-center justify-center ">
                    <img
                        :src="backCoverPage.url"
                        alt="Cover page"
                        class="h-16"
                    >
                    <div>Couverture de fin</div>
                    <EditRoundButton
                        @click="openModalPage('back_cover')"
                    />
                </div>
            </BaseCard>
            <ButtonCard
                v-else
                @click="openModalPage('back_cover')">
                <div class="flex gap-6 items-center justify-center justify-items-center h-full"
                >
                    <div>Ajouter une page de fin</div>
                    <AddButton/>
                </div>
            </ButtonCard>
        </div>

        <BaseBook
            v-if="posts.length"
            :total-records="totalRecords"
            :posts="posts"
            :limit="limit"
            @page="setPage"
            @limit="limit = $event"
        />
        <ImportImage
            v-if="modalPageType"
            :open="showModalPage"
            :page-type="modalPageType"
            :image="modalImage(modalPageType)"
            @submit="saveFiles"
            @close="showModalPage = false"
        />

    </NuxtLayout>
</template>

<script lang="ts">

import PostEntity, {type PostEntityInterface} from "~/entities/PostEntity";
import BaseBook from "~/components/poems/BaseBook.vue";
import type {PostInterface} from "~/server/models/post";
import BaseCard from "~/components/ui/BaseCard.vue";
import AddButton from "~/components/ui/buttons/AddRoundButton.vue";
import ButtonCard from "~/components/ui/ButtonCard.vue";
import type {AttachmentEntityInterface} from "~/entities/AttachmentEntity";
import EditRoundButton from "~/components/ui/buttons/EditRoundButton.vue";
import ImportImage from "~/components/admin/book/ImportImage.vue";

export default {
    components: {
        ImportImage,
        EditRoundButton,
        ButtonCard,
        AddButton,
        BaseCard,
        BaseBook
    },
    data() {
        const toast = useToast();
        return {
            toast,
            images: [] as AttachmentEntityInterface[],
            posts: [] as PostEntityInterface[],
            totalRecords: 0,
            loaded: false,
            count: 1,
            page: 1,
            limit: 1,
            filters: {
                year: null
            },
            showModalPage: false,
            modalPageType: null as string | null,
        };
    },
    computed: {
        coverPage(): AttachmentEntityInterface | null {
            return this.images.find(image => image.pageType === 'cover') || null;
        },
        backCoverPage(): AttachmentEntityInterface | null {
            return this.images.find(image => image.pageType === 'back_cover') || null;
        }
    },
    async mounted() {
        await this.getPosts();
        await this.getImages();
    },
    methods: {
        async setPage(page: number) {
            this.page = page;
            await this.getPosts();
        },
        async getPosts() {
            await fetch(`/api/post?limit=${this.limit}&page=${this.page}`)
                .then(response => response.json())
                .then(data => {
                    this.totalRecords = data.count;
                    this.posts = data.rows.map((post: PostInterface) => {
                        const postEntity = PostEntity.hydrateFromDatabase(post);

                        return {
                            ...postEntity,
                        };
                    });
                });
        },
        async getImages() {
            const {data, error} = await useFetch(`/api/image`);
            if (error.value || !data.value) {
                return;
            }
            this.images = data.value as AttachmentEntityInterface[];
        },
        openModalPage(type: string) {
            this.showModalPage = true;
            this.modalPageType = type;
        },
        modalImage(type: string) {
            return this.images.find(image => image.pageType === type) || null;
        },
        saveFiles(files: File[], pageType: string) {
            const entity = files[0];
            const file = entity.file as File;
            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('data', pageType);
            $fetch('/api/import/image', {
                method: 'POST',
                body: formData
            })
                .then(data => {
                    this.images = data as AttachmentEntityInterface[];

                    this.toast.add({
                        id: 'success',
                        icon: 'i-material-symbols-file-download',
                        title: 'L\'image a été enregistrée avec succès',
                    });
                })
                .catch(() => {
                    this.toast.add({
                        id: 'error',
                        icon: 'i-material-symbols-file-download-off',
                        title: 'Erreur lors de l\'enregistrement de l\'image',
                        color: 'red'
                    });
                });

        },
    }
};

</script>
