export interface PostInterface {
    id: number;
    postTitle: string;
    author: string;
    content: string;
    timestamp: number;
    date: Date;
    attachments?: any[];

    [Symbol.iterator](): Iterator<string>;
}

export default class PostModel implements PostInterface {
    public id: number;
    public postTitle: string;
    public author: string;
    public content: string;
    public timestamp: number;
    public date: Date;
    public attachments?: any[];

    constructor(id: number, postTitle: string, author: string, content: string, timestamp: number, attachments?: any[]) {
        this.id = id;
        this.postTitle = postTitle;
        this.author = author;
        this.content = content;
        this.timestamp = timestamp;
        this.date = new Date(timestamp);
        this.attachments = attachments;
    }

    public static hydrate(data: PostInterface) {
        return new PostModel(
            data.id,
            data.postTitle,
            data.author,
            data.content,
            data.timestamp,
            data.attachments
        );
    }

    * [Symbol.iterator]() {
        yield this.id.toString();
        yield this.postTitle;
        yield this.author;
        yield this.content;
        yield this.timestamp.toString();
        yield this.date.toLocaleDateString('fr');
        yield JSON.stringify(this.attachments);
    }

}
