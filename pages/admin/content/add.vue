<template>
    <NuxtLayout name="admin-page">
        <template #title>Ajouter un contenu</template>
        <BaseForm
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
import PostEntity, {type PostEntityInterface} from "~/entities/PostEntity";
import TextEditor from "~/components/ui/form/TextEditor.vue";

export default {
    components: {TextEditor, BaseForm, BaseInput},
    setup() {
        const toast = useToast();
        return {
            toast
        };
    },
    data() {
        return {
            test: '',
            post: PostEntity.create() as PostEntityInterface,
            token: null,
        };
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
                    title: 'Erreur lors de la création du contenu',
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
