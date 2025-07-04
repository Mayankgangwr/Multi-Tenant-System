import { IUserDocument, UserModel } from "../models/user.model";
import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { IPaginationOptions, IPaginationOptionsDTO } from "../types/comman";
import generatePagination from "../utils/pagination.util";

class UserRepository {
    model: Model<IUserDocument>;

    constructor() {
        this.model = UserModel;
    }

    private readonly deselectedFields = ["password", "refreshToken", "createdAt", "updatedAt", "__v"];

    private get deselectString(): string {
        return this.deselectedFields.map(field => `-${field}`).join(' ');
    }

    async create(data: Partial<IUserDocument>): Promise<IUserDocument> {
        return await this.model.create(data);
    }

    async update(id: string, update: UpdateQuery<IUserDocument>): Promise<IUserDocument | null> {
        return await this.model.findByIdAndUpdate(id, update, { new: true });
    }

    async findById(id: string): Promise<IUserDocument | null> {
        return await this.model.findById(id).select(this.deselectString);
    }

    async findOne(filter: any): Promise<IUserDocument | null> {
        return await this.model.findOne(filter).select(this.deselectString);
    }

    async findAll(
        filter: FilterQuery<IUserDocument> = {},
        options: IPaginationOptionsDTO = {}
    ): Promise<IUserDocument[]> {

        const paginationOptions: IPaginationOptions<IUserDocument> = generatePagination(options);
        const { skip, limit, sort, projection } = paginationOptions;
        const query = this.model.find(filter, projection);

        query.skip(skip);
        query.limit(limit);
        query.sort(sort);
        return await query.exec();
    }


    async findOneWithSencetiveFields(filter: Record<string, any>) {
        return await this.model.findOne(filter);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndUpdate(id, { isDelete: true }, { new: true });
        return !!result;
    }

    async hardDelete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id);
        return !!result;
    }
}

const userRepository = new UserRepository();
export default userRepository;
