import BookModel, {Poem} from "~/models/BookModel";

export const useBookStore = defineStore('bookStore', {
    state: () => ({
        book: {} as BookModel
    }),
    getters: {
        getPoemById: (state) => (id: number) => {
            return state.book?.poems?.find(poem => poem.id === id);
        }

    },
    actions: {
        async fetchBooks(token: string) {

            const query = queryContent<Poem>('book', 'poem');
            if (token) {
                // @todo get user selected ids
                // query.where({id: {$in: [1]}})
            }

            const poems = await query.find()
            this.book = new BookModel(poems)
        }
    }
})
