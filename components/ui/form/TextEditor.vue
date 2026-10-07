<template>
    <div class="flex flex-col gap-1.5">
        <span
            v-if="label"
            :id="`${name}-label`"
            class="text-[13px] text-atelier-muted">{{ label }}</span>
        <div
            v-if="editor"
            class="overflow-hidden rounded-[10px] border border-atelier-line bg-atelier-ground"
        >
            <div
                role="toolbar"
                aria-label="Mise en forme du texte"
                class="flex flex-wrap items-center gap-0.5 border-b border-atelier-line bg-atelier-panel px-3 py-2"
            >
                <button
                    v-for="tool in markTools"
                    :key="tool.name"
                    type="button"
                    class="inline-flex size-9 items-center justify-center rounded-md transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-lilas"
                    :class="editor.isActive(tool.name) ? 'bg-lilas-soft text-lilas-light' : 'text-atelier-muted hover:bg-atelier-hover hover:text-atelier-ink'"
                    :aria-label="tool.label"
                    :aria-pressed="editor.isActive(tool.name)"
                    :title="tool.label"
                    @click="tool.run()"
                >
                    <component
                        :is="tool.icon"
                        class="size-5"
                        aria-hidden="true"/>
                </button>
                <span
                    class="mx-2 h-5 w-px bg-atelier-line"
                    aria-hidden="true"/>
                <button
                    v-for="level in headingLevels"
                    :key="level"
                    type="button"
                    class="inline-flex h-9 items-center justify-center rounded-md px-2 text-[13px] font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-lilas"
                    :class="editor.isActive('heading', {level}) ? 'bg-lilas-soft text-lilas-light' : 'text-atelier-muted hover:bg-atelier-hover hover:text-atelier-ink'"
                    :aria-label="`Titre de niveau ${level}`"
                    :aria-pressed="editor.isActive('heading', {level})"
                    @click="editor.chain().focus().toggleHeading({level}).run()"
                >
                    T{{ level }}
                </button>
                <span
                    class="mx-2 h-5 w-px bg-atelier-line"
                    aria-hidden="true"/>
                <button
                    v-for="align in alignTools"
                    :key="align.value"
                    type="button"
                    class="inline-flex size-9 items-center justify-center rounded-md transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-lilas"
                    :class="editor.isActive({textAlign: align.value}) ? 'bg-lilas-soft text-lilas-light' : 'text-atelier-muted hover:bg-atelier-hover hover:text-atelier-ink'"
                    :aria-label="align.label"
                    :aria-pressed="editor.isActive({textAlign: align.value})"
                    :title="align.label"
                    @click="toggleAlign(align.value)"
                >
                    <svg
                        class="size-5"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="round"
                    ><path :d="align.path"/></svg>
                </button>
            </div>
            <div class="flex justify-center px-4 py-8 sm:px-8">
                <EditorContent
                    class="text-editor-page w-full max-w-[640px] bg-page px-8 py-12 font-newsreader text-[17px] leading-relaxed text-page-ink shadow-page sm:px-16 sm:py-14"
                    :aria-labelledby="label ? `${name}-label` : undefined"
                    :editor="editor"
                />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {Editor, EditorContent} from "@tiptap/vue-3";

import {
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    StrikethroughIcon,
} from "@heroicons/vue/24/outline";
import {Paragraph} from "@tiptap/extension-paragraph";
import {Bold} from "@tiptap/extension-bold";
import {Document} from "@tiptap/extension-document";
import {Text} from "@tiptap/extension-text";
import {Italic} from "@tiptap/extension-italic";
import {Underline} from '@tiptap/extension-underline';
import {TextAlign} from '@tiptap/extension-text-align';
import {Strike} from "@tiptap/extension-strike";
import {Heading} from "@tiptap/extension-heading";
import {HardBreak} from "@tiptap/extension-hard-break";
import {editorHtmlToText, textToEditorHtml} from "~/utils/editorContent";

export default {
    name: "TextEditor",
    components: {EditorContent},
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        name: {
            type: String,
            required: true,
        },
        placeholder: {
            type: String,
            default: '',
        },
        rows: {
            type: Number,
            default: 5,
        },
        label: {
            type: String,
            default: '',
        },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            editor: null as Editor | null,
            headingLevels: [1, 2, 3] as (1 | 2 | 3)[],
            alignTools: [
                {value: 'left', label: 'Aligner à gauche', path: 'M21 6H3M15 12H3M17 18H3'},
                {value: 'center', label: 'Centrer', path: 'M21 6H3M17 12H7M19 18H5'},
                {value: 'right', label: 'Aligner à droite', path: 'M21 6H3M21 12H9M21 18H7'},
                {value: 'justify', label: 'Justifier', path: 'M3 6h18M3 12h18M3 18h18'},
            ],
        };
    },
    computed: {
        markTools() {
            const chain = () => this.editor!.chain().focus();
            return [
                {name: 'bold', label: 'Gras', icon: BoldIcon, run: () => chain().toggleBold().run()},
                {name: 'italic', label: 'Italique', icon: ItalicIcon, run: () => chain().toggleItalic().run()},
                {name: 'underline', label: 'Souligné', icon: UnderlineIcon, run: () => chain().toggleUnderline().run()},
                {name: 'strike', label: 'Barré', icon: StrikethroughIcon, run: () => chain().toggleStrike().run()},
            ];
        },
    },
    mounted() {
        this.editor = new Editor({
            content: textToEditorHtml(this.modelValue),
            injectCSS: false,
            extensions: [
                Document,
                Paragraph,
                Text,
                HardBreak,
                Bold,
                Italic,
                Underline,
                TextAlign.configure({
                    types: ['heading', 'paragraph'],
                }),
                Strike,
                Heading.configure({
                    levels: [1, 2, 3],
                }),
            ],
            onUpdate: () => {
                this.$emit('update:modelValue', editorHtmlToText(this.editor!.getHTML()));
            },
        });
    },
    beforeUnmount() {
        this.editor?.destroy();
    },
    methods: {
        toggleAlign(value: string) {
            if (!this.editor) {
                return;
            }
            if (this.editor.isActive({textAlign: value})) {
                this.editor.chain().focus().unsetTextAlign().run();
            } else {
                this.editor.chain().focus().setTextAlign(value).run();
            }
        },
    }
};
</script>

<style>
.text-editor-page .tiptap {
    min-height: 420px;
    outline: none !important;
    white-space: pre-wrap;
}

.text-editor-page .tiptap h1,
.text-editor-page .tiptap h2,
.text-editor-page .tiptap h3 {
    margin: 0 0 0.75em;
    font-weight: 400;
    line-height: 1.2;
}

.text-editor-page .tiptap h1 { font-size: 1.75em; }
.text-editor-page .tiptap h2 { font-size: 1.4em; font-style: italic; }
.text-editor-page .tiptap h3 { font-size: 1.15em; }

.text-editor-page .tiptap p {
    margin: 0;
}
</style>
