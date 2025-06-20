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
                    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'strong', 'em', 'ul', 'li', 'a', 'img', 'u', 's', 'br'],
                    ALLOWED_ATTR: ['src', 'alt', 'title']
                }
            );
        }
    }
};

</script>
