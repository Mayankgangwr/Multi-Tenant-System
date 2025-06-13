import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { ITenantDocument, TenantModel } from "../models/tenant.model";

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
        options: {
            skip?: number;
            limit?: number;
            sort?: any;
            projection?: any;
        } = {}
    ): Promise<ITenantDocument[]> {
        const query = this.model.find(filter, options.projection);

        if (options.skip !== undefined) query.skip(options.skip);
        if (options.limit !== undefined) query.limit(options.limit);
        if (options.sort !== undefined) query.sort(options.sort);

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