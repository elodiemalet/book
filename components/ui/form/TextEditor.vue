<template>
    <div class="relative">
        <template v-if="editor">
            <div class="w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <div class="px-3 py-2 border-b border-gray-200 dark:border-gray-600">
                    <div class="flex flex-wrap items-center">
                        <div class="flex items-center space-x-1 rtl:space-x-reverse flex-wrap">
                            <div
                                :class="{ 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600': editor.isActive('heading', { level: 1 }) }"
                                class="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                @click="editor.chain().focus().toggleHeading({level: 1}).run()">
                                <H1Icon class="size-5 " aria-hidden="true"/>
                                <span class="sr-only">Heading 1</span>
                            </div>
                            <div
                                :class="{ 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600': editor.isActive('heading', { level: 2 }) }"
                                class="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                @click="editor.chain().focus().toggleHeading({level: 2}).run()">
                                <H2Icon class="size-5 " aria-hidden="true"/>
                                <span class="sr-only">Heading 2</span>
                            </div>
                            <div
                                :class="{ 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600': editor.isActive('heading', { level: 3 }) }"
                                class="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                @click="editor.chain().focus().toggleHeading({level: 3}).run()">
                                <H3Icon class="size-5 " aria-hidden="true"/>
                                <span class="sr-only">Heading 3</span>
                            </div>
                            <div class="px-1">
                                <span class="block w-px h-4 bg-gray-300 dark:bg-gray-600"/>
                            </div>
                            <div
                                :class="{ 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600': editor.isActive('bold') }"
                                class="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                @click="editor.chain().focus().toggleBold().run()">
                                <BoldIcon class="size-5 " aria-hidden="true"/>
                                <span class="sr-only">Bold</span>
                            </div>
                            <div
                                :class="{ 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600': editor.isActive('italic') }"
                                class="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                @click="editor.chain().focus().toggleItalic().run()">
                                <ItalicIcon class="size-5 " aria-hidden="true"/>
                                <span class="sr-only">Italic</span>
                            </div>
                            <div
                                :class="{ 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600': editor.isActive('underline') }"
                                class="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                @click="editor.chain().focus().underline().run()">
                                <UnderlineIcon class="size-5 " aria-hidden="true"/>
                                <span class="sr-only">Underline</span>
                            </div>
                            <div
                                :class="{ 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600': editor.isActive('strike') }"
                                class="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                @click="editor.chain().focus().strike().run()">
                                <StrikethroughIcon class="size-5 " aria-hidden="true"/>
                                <span class="sr-only">Strike</span>
                            </div>
                            <div class="px-1">
                                <span class="block w-px h-4 bg-gray-300 dark:bg-gray-600"/>
                            </div>
                            <div
                                :class="{ 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600': editor.isActive({ textAlign: 'left' }) }"
                                class="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                @click="toggleLeftAlign()">
                                <svg
                                    class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                    height="24" fill="none" viewBox="0 0 24 24">
                                    <path
                                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" d="M6 6h8m-8 4h12M6 14h8m-8 4h12"/>
                                </svg>
                                <span class="sr-only">Align left</span>
                            </div>
                            <div
                                :class="{ 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600': editor.isActive({ textAlign: 'center' }) }"
                                class="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                @click="toggleCenterAlign()">
                                <svg
                                    class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                    height="24" fill="none" viewBox="0 0 24 24">
                                    <path
                                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" d="M8 6h8M6 10h12M8 14h8M6 18h12"/>
                                </svg>
                                <span class="sr-only">Align center</span>
                            </div>
                            <div
                                :class="{ 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600': editor.isActive({ textAlign: 'right' }) }"
                                class="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                @click="toggleRightAlign()">
                                <svg
                                    class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                    height="24" fill="none" viewBox="0 0 24 24">
                                    <path
                                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" d="M18 6h-8m8 4H6m12 4h-8m8 4H6"/>
                                </svg>
                                <span class="sr-only">Align right</span>
                            </div>
                            <div
                                :class="{ 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600': editor.isActive({ textAlign: 'justify' }) }"
                                class="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                @click="toggleJustify()">
                                <svg
                                    class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                    height="24" fill="none" viewBox="0 0 24 24">
                                    <path
                                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" d="M18 6H6m12 4H6m12 4H6m12 4H6"/>
                                </svg>
                                <span class="sr-only">Justify</span>
                            </div>
                        </div>
                    </div>
                </div>
                <EditorContent
                    class="block w-full min-h-8 rounded-md bg-white text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    :editor="editor"
                />
            </div>
        </template>
    </div>
</template>
<script lang="ts">
import {Editor, EditorContent} from "@tiptap/vue-3";

import {
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    StrikethroughIcon,
    H1Icon,
    H2Icon,
    H3Icon
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

export default {
    name: "TextEditor",
    components: {EditorContent, BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, H1Icon, H2Icon, H3Icon},
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
    },
    emits: ['update:modelValue'],
    data() {
        return {
            editor: null as any,
        };
    },
    mounted() {
        this.editor = new Editor({
            content: this.modelValue,
            injectCSS: false,
            extensions: [
                Document,
                Paragraph,
                Text,
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
                this.$emit('update:modelValue', this.editor.getHTML());
            },
        });
    },
    beforeUnmount() {
        this.editor.destroy();
    },
    methods: {
        toggleLeftAlign() {
            if (this.editor.isActive({textAlign: 'left'})) {
                this.editor.chain().focus().unsetTextAlign().run();
            } else {
                this.editor.chain().focus().setTextAlign('left').run();
            }
        },
        toggleCenterAlign() {
            if (this.editor.isActive({textAlign: 'center'})) {
                this.editor.chain().focus().unsetTextAlign().run();
            } else {
                this.editor.chain().focus().setTextAlign('center').run();
            }
        },
        toggleRightAlign() {
            if (this.editor.isActive({textAlign: 'right'})) {
                this.editor.chain().focus().unsetTextAlign().run();
            } else {
                this.editor.chain().focus().setTextAlign('right').run();
            }
        },
        toggleJustify() {
            if (this.editor.isActive({textAlign: 'justify'})) {
                this.editor.chain().focus().unsetTextAlign().run();
            } else {
                this.editor.chain().focus().setTextAlign('justify').run();
            }
        },
    }
};
</script>

<style>
.tiptap {
    padding: 5px;
    min-height: 100px;
    outline: none !important;
}
</style>
