import BaseRepository from "./base.repository";
import { IUserDocument } from "../models/user.model";
import { UserModel } from "../models/user.model";
import { UpdateQuery } from "mongoose";

class UserRepository extends BaseRepository<IUserDocument> {
    constructor() {
        super(UserModel);
    }

    private readonly deselectedFields = ["password", "refreshToken", "createdAt", "updatedAt", "__v"];

    private get deselectString(): string {
        return this.deselectedFields.map(field => `-${field}`).join(' ');
    }

    async findByEmailWithSencetiveFields(email: string) {
        return await this.model.findOne({ email });
    }

    async findByEmail(email: string) {
        return await this.model.findOne({ email }).select(this.deselectString);
    }

    async findById(id: string): Promise<IUserDocument | null> {
        return await this.model.findById(id).select(this.deselectString);
    }

    async findOne(filter: any): Promise<IUserDocument | null> {
        return await this.model.findOne(filter).select(this.deselectString);
    }

    async findAll(filter: any = {}): Promise<IUserDocument[]> {
        return await this.model.find(filter).select(this.deselectString);
    }
}

const userRepository = new UserRepository();
export default userRepository;
