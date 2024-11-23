export interface PoemInterface {
    id: number;
    title: string;
    author: string;
    content: string;

    [Symbol.iterator](): Iterator<string>;
}

export interface BookInterface {
    poems: PoemInterface[];
}

export class Poem implements PoemInterface {
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

export default class BookModel implements BookInterface {
    public poems: PoemInterface[];

    constructor(poems: PoemInterface[]) {
        this.poems = poems.map(poem => new Poem(poem.id, poem.title, poem.author, poem.content));
    }
}
