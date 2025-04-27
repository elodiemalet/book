import BookEntity, {PoemEntity} from "~/entities/BookEntity";
import {AttachmentEntity, type AttachmentEntityInterface} from "~/entities/AttachmentEntity";

export const useBookStore = defineStore('bookStore', {
    state: () => ({
        imagePages: [] as AttachmentEntityInterface[],
    }),
    getters: {
        getImagePageByType: (state) => (type: string) => {
            return state.imagePages.find(image => image.pageType === type);
        }
    },
    actions: {
        async fetchImagePages() {
            console.log('fetchImagePages')
            const {data, error} = await useFetch<AttachmentEntityInterface[]>(`/api/image`)
            if (error.value || !data.value) {
                return
            }
            this.imagePages = data.value
        }
    }
})
