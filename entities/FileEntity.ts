export interface FileEntityInterface {
    id: string;
    name: string;
    size: number;
    type: string;
    file: File;
}

export class FileEntity implements FileEntityInterface {
    id: string;
    name: string;
    size: number;
    type: string;
    file: File;

    constructor(id: string, name: string, size: number, type: string, file: File) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.type = type;
        this.file = file;
    }
}