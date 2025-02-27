export interface PoemEntityInterface {
    id: number;
    title: string;
    author: string;
    content: string;

    [Symbol.iterator](): Iterator<string>;
}

export interface BookEntityInterface {
    poems: PoemEntityInterface[];
}

export class PoemEntity implements PoemEntityInterface {
    public id: number;
    public title: string;
    public author: string;
    public content: string;

    constructor(id: number, title: string, author: string, content: string) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.content = content;
    }

    * [Symbol.iterator]() {
        yield this.id.toString();
        yield this.title;
        yield this.author;
        yield this.content;
    }
}

export default class BookEntity implements BookEntityInterface {
    public poems: PoemEntityInterface[];

    constructor(poems: PoemEntityInterface[]) {
        this.poems = poems.map(poem => new PoemEntity(poem.id, poem.title, poem.author, poem.content));
    }
}
