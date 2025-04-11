import type {PostInterface} from "~/server/models/post";

export interface PostEntityInterface {
    id: number | null;
    postTitle: string;
    author: string;
    content: string;
    timestamp: number;
    date: Date;
    attachments?: any[];

    [Symbol.iterator](): Iterator<string>;
}

export default class PostEntity implements PostEntityInterface {
    public id: number | null;
    public postTitle: string;
    public author: string;
    public content: string;
    public timestamp: number;
    public date: Date;
    public attachments?: any[];

    constructor(id: number | null, postTitle: string, author: string, content: string, timestamp: number, attachments?: any[]) {
        this.id = id;
        this.postTitle = postTitle;
        this.author = author;
        this.content = content;
        this.timestamp = timestamp;
        this.date = new Date(timestamp);
        this.attachments = attachments;
    }

    public static hydrate(data: PostEntityInterface) {
        return new PostEntity(
            data.id,
            data.postTitle,
            data.author,
            data.content,
            data.timestamp,
            data.attachments
        );
    }

    public static hydrateFromDatabase(data: PostInterface) {
        return new PostEntity(
            data.id,
            data.postTitle,
            data.author,
            data.content,
            new Date(data.createdAt).getTime(),
        );
    }

    * [Symbol.iterator]() {
        yield this.id?.toString() ?? '';
        yield this.postTitle;
        yield this.author;
        yield this.content;
        yield this.timestamp.toString();
        yield this.date.toLocaleDateString('fr');
        yield JSON.stringify(this.attachments);
    }

    public static create(postTitle: string = '', author: string = '', content: string = '', attachments?: any[]) {
        return new PostEntity(null, postTitle, author, content, new Date().getTime(), attachments);
    }
}
