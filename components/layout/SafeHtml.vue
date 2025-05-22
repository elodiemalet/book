<template>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="safeHtml"/>
</template>

<script lang="ts">

// dans votre composant
import DOMPurify from 'dompurify';

export default {
    props: {
        rawHtml: {
            type: String,
            required: true
        }
    },
    computed: {
        safeHtml() {
            // supprime tout ce qui peut être dangereux
            return DOMPurify.sanitize(
                this.rawHtml,
                {
                    ALLOWED_TAGS: ['h2', 'p', 'strong', 'em', 'ul', 'li', 'a', 'img'],
                    ALLOWED_ATTR: ['src', 'alt', 'title']
                }
            );
        }
    }
};

</script>
