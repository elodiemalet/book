export interface ProspectInterface {
    id: number;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export class ProspectEntity implements ProspectInterface {
    public id!: number;
    public email!: string;
    public createdAt!: Date;
    public updatedAt!: Date;

    constructor(prospect: ProspectInterface) {
        this.id = prospect.id;
        this.email = prospect.email;
        this.createdAt = prospect.createdAt;
        this.updatedAt = prospect.updatedAt;
    }
}
