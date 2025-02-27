import BookEntity, {PoemEntity} from "~/entities/BookEntity";

export const useBookStore = defineStore('bookStore', {
    state: () => ({
        book: {} as BookEntity
    }),
    getters: {
        getPoemById: (state) => (id: number) => {
            return state.book?.poems?.find(poem => poem.id === id);
        }

    },
    actions: {
        async fetchBooks(token: string) {

            const query = queryContent<PoemEntity>('book', 'poem');
            if (token) {
                // @todo get user selected ids
                // query.where({id: {$in: [1]}})
            }

            const poems = await query.find()
            this.book = new BookEntity(poems)
        }
    }
})
