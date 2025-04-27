<template>
    <NuxtLayout name="admin-page">
        <template #title>Mon livre</template>
        <div class="flex gap-4">
            <base-card v-if="coverPage">
                <div class="flex gap-6 items-center justify-center ">
                    <img
                        :src="coverPage.url"
                        alt="Cover page"
                        class="h-16"
                    >
                    <div>Page de couverture</div>
                    <edit-round-button
                        @click="openModalPage('cover')"
                    />
                </div>
            </base-card>
            <button-card
                v-else
                @click="openModalPage('cover')">
                <div class="flex gap-6 items-center justify-center justify-items-center">
                    <div>Ajouter une page de présentation</div>
                    <add-button/>
                </div>
            </button-card>
            <base-card v-if="backCoverPage">
                <div class="flex gap-6 items-center justify-center ">
                    <img
                        :src="backCoverPage.url"
                        alt="Cover page"
                        class="h-16"
                    >
                    <div>Couverture de fin</div>
                    <edit-round-button
                        @click="openModalPage('back_cover')"
                    />
                </div>
            </base-card>
            <button-card
                v-else
                @click="openModalPage('back_cover')">
                <div class="flex gap-6 items-center justify-center justify-items-center h-full"
                >
                    <div>Ajouter une page de fin</div>
                    <add-button/>
                </div>
            </button-card>
        </div>

        <base-book
            v-if="posts.length"
            :totalRecords="totalRecords"
            :posts="posts"
            :limit="limit"
            @page="setPage"
            @limit="limit = $event"
        />
        <ImportImage
            v-if="modalPageType"
            :open="showModalPage"
            :pageType="modalPageType"
            :image="modalImage(modalPageType)"
            @submit="saveFiles"
            @close="showModalPage = false"
        />

    </NuxtLayout>
</template>

<script lang="ts">

import PostEntity, {type PostEntityInterface} from "~/entities/PostEntity";
import PoemPage from "~/components/poems/bookPages/PoemPage.vue";
import BaseBook from "~/components/poems/BaseBook.vue";
import type {PostInterface} from "~/server/models/post";
import BaseCard from "~/components/ui/BaseCard.vue";
import AddButton from "~/components/ui/buttons/AddRoundButton.vue";
import ButtonCard from "~/components/ui/ButtonCard.vue";
import type {AttachmentEntityInterface} from "~/entities/AttachmentEntity";
import EditRoundButton from "~/components/ui/buttons/EditRoundButton.vue";
import BaseDrawer from "~/components/ui/BaseDrawer.vue";
import BaseDropzone from "~/components/ui/BaseDropzone.vue";
import BaseButton from "~/components/ui/buttons/BaseButton.vue";
import ImportImage from "~/components/admin/book/ImportImage.vue";

export default {
    components: {
        ImportImage,
        BaseButton, BaseDropzone, BaseDrawer, EditRoundButton, ButtonCard, AddButton, BaseCard, BaseBook, PoemPage
    },
    data() {
        const toast = useToast()
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
        }
    },
    async mounted() {
        await this.getPosts()
        await this.getImages()
    },
    computed: {
        coverPage(): AttachmentEntityInterface | null {
            return this.images.find(image => image.pageType === 'cover') || null
        },
        backCoverPage(): AttachmentEntityInterface | null {
            return this.images.find(image => image.pageType === 'back_cover') || null
        }
    },
    methods: {
        async setPage(page: number) {
            this.page = page
            await this.getPosts()
        },
        async getPosts() {
            await fetch(`/api/post?limit=${this.limit}&page=${this.page}`)
                .then(response => response.json())
                .then(data => {
                    this.totalRecords = data.count
                    this.posts = data.rows.map((post: PostInterface) => {
                        const postEntity = PostEntity.hydrateFromDatabase(post)

                        return {
                            ...postEntity,
                        }
                    })
                })
        },
        async getImages() {
            const {data, error} = await useFetch(`/api/image`)
            if (error.value || !data.value) {
                return
            }
            this.images = data.value as AttachmentEntityInterface[]
        },
        openModalPage(type: string) {
            this.showModalPage = true
            this.modalPageType = type
        },
        modalImage(type: string) {
            return this.images.find(image => image.pageType === type) || null
        },
        async saveFiles(files: File[], pageType: string) {
            const entity = files[0] as any;
            const file = entity.file as File;
            console.log(file);
            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('data', pageType);
            const {data, error} = await useFetch('/api/import/image', {
                method: 'POST',
                body: formData
            });

            if (error.value) {
                this.toast.add({
                    id: 'error',
                    icon: 'i-material-symbols-file-download-off',
                    title: 'Erreur lors de l\'enregistrement de l\'image',
                    color: 'red',

                });
                return
            }

            this.images = data.value as AttachmentEntityInterface[]

            this.toast.add({
                id: 'success',
                icon: 'i-material-symbols-file-download',
                title: 'L\'image a été enregistrée avec succès',
            });

        },
    }
}

</script>

