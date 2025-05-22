import Post from "~/server/models/post";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const limit: number = parseInt(Array.isArray(query.limit) ? query.limit[0] : query.limit) || 10;
    const page: number = parseInt(Array.isArray(query.page) ? query.page[0] : query.page) || 1;

    const queryPosts = Post.findAndCountAll({
        limit: limit,
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']],
    });

    try {
        return await queryPosts;
    } catch (error) {
        return error;
    }
});
