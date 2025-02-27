import Post from "~/server/models/post";

export default defineEventHandler(async (event) => {
    try {
        return await Post.findAll();
    } catch (error) {
        console.error(error);
        return error
    }
});