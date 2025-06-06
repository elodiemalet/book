import {extract as FeedExtractor} from "@extractus/feed-extractor";
import {extract as ArticleExtractor} from "@extractus/article-extractor";
import DOMPurify from "dompurify";
import type {PostInterface} from "~/server/models/post";
import Post from "~/server/models/post";
import {JSDOM} from 'jsdom';
import slugify from "slugify";
import {createHash} from 'crypto';

export class FluxImporter {
    private readonly _url: string;

    constructor(url: string) {
        this._url = url;
    }

    public async import() {
        const url = this._url;

        const feed = await FeedExtractor(url);
        if (!feed || !feed.entries) {
            throw createError({
                statusCode: 404,
                statusMessage: 'No articles found'
            });
        }

        return feed;

        const contents: PostInterface[] = [];
        for (const item of feed.entries) {
            if (item.link && item.id) {

                const {title, content, author, published} = await ArticleExtractor(item.link);
                if (!title || !content || !author || !item.id || !published) {
                    continue;
                }

                const slug = slugify(item.id, {lower: true, strict: true});
                const externalId = createHash('md5').update(slug).digest('hex');

                const window = new JSDOM('').window;
                const purify = DOMPurify(window);
                const sanitizedContent = purify.sanitize(content, {
                    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'strong', 'em', 'ul', 'li', 'a', 'img', 'u', 's'],
                    ALLOWED_ATTR: ['src', 'alt', 'title']
                });

                Post.create({
                    postTitle: title,
                    author: author,
                    content: sanitizedContent,
                    externalId: externalId,
                    publishDate: new Date(published),
                }).then((post) => {
                    contents.push(post);
                }).catch((error) => {
                    throw createError({
                        statusCode: 500,
                        statusMessage: error.message
                    });
                });

            }
        }

        return contents;

    }

}
