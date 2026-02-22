import type {AttachmentEntityInterface} from "~/entities/AttachmentEntity";

export interface BookConfigState {
    title: string;
    author: string;
    years: string;
    dedicationText: string;
    dedicationAuthor: string;
    prefaceText: string;
    pageFormat: string;
    maxLines: number;
    maxLinesFirstPage: number;
    pageStart: number;
}

export const useBookStore = defineStore('bookStore', {
    state: () => ({
        imagePages: [] as AttachmentEntityInterface[],
        config: {
            title: 'Recueil de Poèmes',
            author: '',
            years: '2019 - 2024',
            dedicationText: '',
            dedicationAuthor: '',
            prefaceText: '',
            pageFormat: 'a4',
            maxLines: 38,
            maxLinesFirstPage: 32,
            pageStart: 6,
        } as BookConfigState,
        configLoaded: false,
    }),
    getters: {
        getImagePageByType: (state) => (type: string) => {
            return state.imagePages.find(image => image.pageType === type);
        },
        bookCssClass: (state) => `book-${state.config.pageFormat}`,
    },
    actions: {
        async fetchImagePages() {
            const {data, error} = await useFetch<AttachmentEntityInterface[]>(`/api/image`);
            if (error.value || !data.value) {
                return;
            }
            this.imagePages = data.value;
        },
        async fetchConfig() {
            const data = await $fetch<BookConfigState>('/api/book-config');
            if (data) {
                this.config = data;
            }
            this.configLoaded = true;
        },
        async saveConfig(config: BookConfigState) {
            const data = await $fetch<BookConfigState>('/api/book-config', {
                method: 'PUT',
                body: config,
            });
            if (data) {
                this.config = data;
            }
        },
    }
});
