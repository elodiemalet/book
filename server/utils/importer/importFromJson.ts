import Post, {getPostSchemaValidator} from "~/server/models/post";
import sanitize from "dompurify";
import {extractWithPandoc} from "~/server/services/pandoc";
import {AiHttpClient} from "~/server/services/aiHttpClient";
import {sanitizeContent} from "~/server/services/contentSanitizer";

export async function importFromJson(json: any) {
    const {data} = json;

    return await Promise.all([
        importPosts(data),
    ]);
}

export async function importFromText(files: any) {
    const {data} = files;

    return await Promise.all([
        getPostsFromTextFiles(data),
    ]);
}

async function getPostsFromTextFiles(files: any) {

    const aiApi = new AiHttpClient();

    const texts = await Promise.all(
        files.map(async (file) => {
            try {
                const fileExtension = file?.filename.split('.').pop() || '';
                const text = await extractWithPandoc(file.data, fileExtension);
                const documentInformation = await aiApi.getDocumentInformation(text);
                return JSON.parse(documentInformation.choices[0].message.content);
            } catch (e) {
                console.error('error', e);
                return null;
            }
        })
    );

    return importPosts(texts);
}

async function importPosts(posts: any[]) {

    const resultImport = await Promise.all(posts.map(async (post) => {
        //valid
        const isValid = await getPostSchemaValidator().isValid(post);
        if (!isValid) {
            console.error('invalid post', post);
            return false;
        }

        let date = new Date(post.publishDate);
        if (isNaN(date.getTime())) {
            date = new Date();
        }

        const content = sanitizeContent(post.content);

        await Post.create({
            postTitle: post.postTitle,
            author: post.author,
            content: content,
            attachments: post.attachments,
            publishDate: date,
        });

        return true;
    }));

    return {
        posts: {
            success: resultImport.filter(item => item === true).length,
            error: resultImport.filter(item => item === false).length,
            total: resultImport.length,
        }
    };
}
