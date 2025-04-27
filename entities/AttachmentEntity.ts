export interface AttachmentEntityInterface {
    id: string;
    name: string;
    size: number;
    type: string;
    pageType: string;
    url: string;
}

export class AttachmentEntity implements AttachmentEntityInterface {
    id: string;
    name: string;
    size: number;
    type: string;
    pageType: string;
    url: string;

    constructor(id: string, name: string, size: number, type: string, pageType: string, url: string) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.type = type;
        this.pageType = pageType;
        this.url = url;
    }
}