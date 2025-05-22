import Post, {getPostSchemaValidator} from "~/server/models/post";

export async function importFromJson(json: any) {
    const {data} = json;

    return await Promise.all([
        importPosts(data),
    ]);
}

async function importPosts(posts: any[]) {

    const test = await Promise.all(posts.map(async (post) => {
        //valid
        const isValid = await getPostSchemaValidator().isValid(post);
        if (!isValid) {
            console.error('invalid post', post);
            return false;
        }

        await Post.create({
            postTitle: post.postTitle,
            author: post.author,
            content: post.content,
            attachments: post.attachments,
        });

        return true;
    }));

    return {
        posts: {
            success: test.filter(item => item === true).length,
            error: test.filter(item => item === false).length,
            total: test.length,
        }
    };
}
