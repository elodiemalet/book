import PostEntity from "~/entities/PostEntity";
import type {QueryBuilder} from "@nuxt/content";

export const usePostStore = defineStore('postStore', {
    state: () => ({
        posts: [] as PostEntity[],
    }),
    getters: {
        getPostById: (state) => (id: number) => {
            return state.posts.find(post => post.id === id)
        }

    },
    actions: {
        async fetchPosts(token: string | null = null, page: number = 1, limit: number = 0, filters: any = null) {

            let query = queryContent<PostEntity>('posts');
            if (token) {
                // @todo get user selected ids
                // query.where({id: {$in: [1]}})
            }

            query = this.filterQuery(query, filters)

            query.sort({timestamp: 1})

            if (limit) {
                query.limit(limit)
                query.skip((page - 1) * limit)
            }

            this.posts = await query.find()

        },
        async fetchPostById(id: number) {
            const query = queryContent<PostEntity>('posts');
            query.where({id})
            this.posts = await query.find()
        },
        async countPosts(token: string | null = null, filters: any = null) {
            let query = queryContent<PostEntity>('posts');
            if (token) {
                // @todo get user selected ids
                // query.where({id: {$in: [1]}})
            }

            query = this.filterQuery(query, filters)

            return await query.count()
        },
        filterQuery(query: QueryBuilder<PostEntity>, filters: any): QueryBuilder<PostEntity> {
            if (filters) {
                if (filters.year) {
                    const date = new Date(`${filters.year}-01-01`).getTime()
                    const date2 = new Date(`${filters.year + 1}-01-01`).getTime()
                    query.where({timestamp: {$gt: date}})
                    query.where({timestamp: {$lt: date2}})
                }
            }
            return query
        }
    }
})
