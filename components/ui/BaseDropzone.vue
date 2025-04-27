<template>
    <div>
        <label
            v-if="label.length > 0"
            for="cover-photo"
            class="block text-sm/6 font-medium text-gray-900">{{ label }}</label>
        <div
            ref="dropZoneRef"
            :class="{'bg-gray-200': isOverDropZone}"
            class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div class="flex flex-col items-center justify-center gap-2">
                <div class="mt-4 flex text-sm/6 text-gray-600">
                    <label for="file-upload"
                           class="relative ">
                        <span
                            class=" cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                            Télécharger un fichier
                        </span>
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            class="sr-only"
                            :accept="accept.join('|')"
                            @change="addFile"
                        />
                    </label>
                </div>
                <p class="text-xs/5 text-gray-600"> ou faites glisser et déposez vos fichiers {{ types }} jusqu'à
                    {{ maxSizeMb }}</p>
            </div>
        </div>
        <ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            <li v-for="(file, index) in fileList" :key="index" class="col-span-1 flex rounded-md shadow-sm">
                <div
                    class="flex flex-1 items-center justify-between truncate rounded-r-md border border-gray-200 bg-white">
                    <div class="flex-1 truncate px-4 py-2 text-sm">
                        <a href="#" class="font-medium text-gray-900 hover:text-gray-600">
                            {{
                                file.name
                            }}
                        </a>
                        <p class="text-gray-500">{{ getSize(file.size) }}</p>
                    </div>
                    <div class="shrink-0 pr-2">
                        <button type="button"
                                class="inline-flex size-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2"
                                @click="removeFile(file)">
                            <span class="sr-only">Open options</span>
                            <TrashIcon
                                class="size-5 hover:text-red-700 focus:text-red-700"
                                aria-hidden="true"/>
                        </button>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>


<script lang="ts">
import {useDropZone} from '@vueuse/core'
import {TrashIcon} from "@heroicons/vue/24/outline";
import {FileEntity} from "~/entities/FileEntity";

export default defineComponent({
    name: "BaseDropzone",
    components: {TrashIcon},
    props: {
        accept: {
            type: Array<string>,
            default: ['image/jpeg', 'image/png', 'application/json'],
        },
        maxSize: {
            type: Number,
            default: 1024 * 1024 * 10,
        },
        maxFiles: {
            type: Number,
            default: 1,
        },
        label: {
            type: String,
            default: '',
        },
        files: {
            type: Array<FileEntity>,
            default: () => [],
        }
    },
    computed: {
        maxSizeMb() {
            return Math.round(this.maxSize / 1024 / 1024 * 10) / 10 + 'MB'
        },
        types() {
            return this.accept.join(', ').replace('application/', '').toUpperCase()
        }
    },
    setup(props) {
        const dropZoneRef = ref<HTMLElement | null>(null);
        const fileList = ref<FileEntity[]>(props.files);
        const toast = useToast()

        watch(
            () => props.files,
            (newFiles) => {
                fileList.value = newFiles;
            },
            {immediate: true}
        );

        const onDrop = (files: File[] | null) => {
            if (files) {
                files.forEach(file => {
                    if (fileList.value.length >= props.maxFiles) {
                        toast.add({
                            id: 'error',
                            title: 'Erreur lors du téléchargement du fichier',
                            color: 'red',
                            icon: 'i-material-symbols-file-download-off',
                        });
                        return
                    }
                    if (file.size > props.maxSize) {
                        toast.add({
                            id: 'error',
                            title: 'Erreur lors du téléchargement du fichier',
                            color: 'red',
                            icon: 'i-material-symbols-file-download-off',
                        });
                        return
                    }
                    const id = file.name + new Date().getTime();
                    const fileEntity = new FileEntity(id, file.name, file.size, file.type, file);
                    fileList.value.push(fileEntity)
                })
            }
        }

        const {isOverDropZone} = useDropZone(dropZoneRef, {
            onDrop,
            dataTypes: props.accept,
            multiple: props.maxFiles > 1,
            preventDefaultForUnhandled: true,
        });

        return {
            dropZoneRef,
            isOverDropZone,
            fileList
        }
    },
    methods: {
        getSize(size: number) {
            const sizes = ['Octet', 'Ko', 'Mo', 'Go', 'To'];
            if (size === 0) return '0 Byte';
            const i = Math.floor(Math.log(size) / Math.log(1024));
            return (size / Math.pow(1024, i)) + ' ' + sizes[i];
        },
        removeFile(file: FileEntity) {
            this.fileList = this.fileList.filter(f => f.id !== file.id)
        },
        addFile(event: Event) {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                if (file.size > this.maxSize) {
                    alert('File too large')
                    return
                }
                const id = file.name + new Date().getTime();
                const fileEntity = new FileEntity(id, file.name, file.size, file.type, file);
                this.fileList.push(fileEntity)
            }
        }
    }
})

</script>