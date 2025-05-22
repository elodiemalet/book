<template>
    <NuxtLayout name="admin-page">
        <template #title>Edition du contenu</template>
        <BaseForm
            v-if="post"
            @cancel="cancel"
            @submit="submit"
        >
            <BaseInput
                v-model="post.postTitle"
                name="postTitle"
                label="Titre"
            />
            <TextEditor
                v-model="post.content"
                name="content"
                label="Contenu"
            />
        </BaseForm>
    </NuxtLayout>
</template>

<script lang="ts">
import BaseForm from "~/components/ui/form/BaseForm.vue";
import BaseInput from "~/components/ui/form/BaseInput.vue";
import type {PostEntityInterface} from "~/entities/PostEntity";
import TextEditor from "~/components/ui/form/TextEditor.vue";

export default {
    components: {TextEditor, BaseForm, BaseInput},
    async setup() {
        const toast = useToast();
        const route = useRoute();

        return {
            id: route.params.id,
            toast,
        };
    },
    data() {
        return {
            post: null as PostEntityInterface | null,
        };
    },
    async created() {
        const {data, error} = await useFetch(`/api/post/${this.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (error.value) {
            this.toast.add({
                id: 'error',
                icon: 'i-material-symbols-file-download-off',
                title: 'Erreur lors de la récupération du contenu',
                color: 'red',

            });
            return;
        }
        this.post = data.value as PostEntityInterface;
    },
    methods: {
        async cancel() {
            await navigateTo('/admin/content');
        },
        async submit() {
            const {error} = await useFetch('/api/post', {
                method: 'POST',
                body: JSON.stringify(this.post),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (error.value) {
                this.toast.add({
                    id: 'error',
                    icon: 'i-material-symbols-file-download-off',
                    title: 'Erreur lors de la modification du contenu',
                    color: 'red',

                });
                return;
            }

            this.toast.add({
                id: 'success',
                icon: 'i-material-symbols-file-download-off',
                title: 'Contenu créé avec succès',
            });
            navigateTo('/admin/content');
        }
    }
};
</script>
