<template>
    <NuxtLayout name="admin-page">
        <template #title>Edition du contenu</template>
        <BaseForm
            @cancel="cancel"
            @submit="submit"
        >
            <div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6">
                <div>
                    <BaseInput
                        v-model="post.postTitle"
                        name="postTitle"
                        label="Titre"
                    />
                </div>
                <div>
                    <BaseInput
                        v-model="post.author"
                        name="author"
                        label="Auteur"
                    />
                </div>
            </div>
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
        const toast = useToast()
        return {
            toast
        }
    },
    data() {
        return {
            test: '',
            post: PostEntity.create() as PostEntityInterface,
            token: null,
        }
    },
    methods: {
        async cancel() {
            await navigateTo('/admin/content')
        },
        async submit() {
            console.log(this.post)
        }
    }
}
</script>