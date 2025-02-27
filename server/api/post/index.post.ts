import Post from "~/server/models/post";

export default defineEventHandler(async (event/**/) => {

    try {
        return await Post.create({
            postTitle: "Hello World",
            author: "John Doe",
            content: "This is my first blog post!",
            attachments: "https://www.example.com/image.jpg"
        })
    } catch (error) {
        console.log(error)
        return error
    }

})