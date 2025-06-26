import Post from "~/server/models/post";

export default defineEventHandler(async (event) => {
    //@todo : access control from front only
    const id = getRouterParam(event, 'id');

    try {
        return await Post.findByPk(id);
    } catch (error) {
        return error;
    }
});
