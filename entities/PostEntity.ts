import type {PostInterface} from "~/server/models/post";

export interface PostEntityInterface {
    id: number | null;
    postTitle: string;
    author: string;
    content: string;
    timestamp: number;
    date: Date;
    publishDate: Date;
    attachments?: any[];
}

export default class PostEntity implements PostEntityInterface {
    public id: number | null;
    public postTitle: string;
    public author: string;
    public content: string;
    public timestamp: number;
    public date: Date;
    public publishDate: Date;
    public attachments?: any[];

    constructor(id: number | null, postTitle: string, author: string, content: string, timestamp: number, publishDate: Date, attachments?: any[]) {
        this.id = id;
        this.postTitle = postTitle;
        this.author = author;
        this.content = content;
        this.timestamp = timestamp;
        this.date = new Date(timestamp);
        this.publishDate = publishDate;
        this.attachments = attachments;
    }

    public static hydrateFromDatabase(data: PostInterface) {
        return new PostEntity(
            data.id,
            data.postTitle,
            data.author,
            data.content,
            new Date(data.createdAt).getTime(),
            new Date(data.publishDate),
        );
    }

    * [Symbol.iterator]() {
        yield this.id?.toString() ?? '';
        yield this.postTitle;
        yield this.author;
        yield this.content;
        yield this.timestamp.toString();
        yield this.date.toLocaleDateString('fr');
        yield this.publishDate.toLocaleDateString('fr');
        yield JSON.stringify(this.attachments);
    }

    public static create(postTitle: string = '', author: string = '', content: string = '', attachments?: any[]) {
        return new PostEntity(null, postTitle, author, content, new Date().getTime(), new Date().getTime(), attachments);
    }
}
