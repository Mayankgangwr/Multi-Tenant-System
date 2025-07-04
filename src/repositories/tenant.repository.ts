import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { ITenantDocument, TenantModel } from "../models/tenant.model";
import { IPaginationOptions, IPaginationOptionsDTO } from "../types/comman";
import generatePagination from "../utils/pagination.util";

class TenantRepository {
    model: Model<ITenantDocument>;
    constructor() {
        this.model = TenantModel;
    }

    async create(data: Partial<ITenantDocument>): Promise<ITenantDocument> {
        return await this.model.create(data);
    }

    async findById(id: string): Promise<ITenantDocument | null> {
        return await this.model.findById(id); // no select
    }

    async findOne(filter: FilterQuery<ITenantDocument>): Promise<ITenantDocument | null> {
        return await this.model.findOne(filter);
    }

    async findAll(
        filter: FilterQuery<ITenantDocument> = {},
        options: IPaginationOptionsDTO = {}
    ): Promise<ITenantDocument[]> {

        const paginationOptions: IPaginationOptions<ITenantDocument> = generatePagination(options);
        const { skip, limit, sort, projection } = paginationOptions;
        const query = this.model.find(filter, projection);

        query.skip(skip);
        query.limit(limit);
        query.sort(sort);
        return await query.exec();
    }


    async findByEmail(email: string): Promise<ITenantDocument | null> {
        return await this.model.findOne({ email });
    }

    async update(id: string, update: UpdateQuery<ITenantDocument>): Promise<ITenantDocument | null> {
        return await this.model.findByIdAndUpdate(id, update, { new: true });
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

const tenantRepository = new TenantRepository();
export default tenantRepository;