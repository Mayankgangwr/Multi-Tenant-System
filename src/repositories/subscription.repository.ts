import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { ISubscriptionDocument, SubscriptionModel } from "../models/subscription.model";
import { IPaginationOptions, IPaginationOptionsDTO } from "../types/comman";
import generatePagination from "../utils/pagination.util";

class SubscriptionRepository {
    model: Model<ISubscriptionDocument>;

    constructor() {
        this.model = SubscriptionModel;
    }

    async create(data: Partial<ISubscriptionDocument>): Promise<ISubscriptionDocument> {
        return await this.model.create(data);
    }

    async findById(id: string): Promise<ISubscriptionDocument | null> {
        return await this.model.findById(id);
    }

    async findAll(
        filter: FilterQuery<ISubscriptionDocument> = {},
        options: IPaginationOptionsDTO = {}
    ): Promise<ISubscriptionDocument[]> {
        const paginationOptions: IPaginationOptions<ISubscriptionDocument> = generatePagination(options);
        const { skip, limit, sort, projection } = paginationOptions;

        const query = this.model.find(filter, projection);

        query.skip(skip);
        query.limit(limit);
        query.sort(sort);
        return await query.exec();
    }


    async update(id: string, update: UpdateQuery<ISubscriptionDocument>): Promise<ISubscriptionDocument | null> {
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

const subscriptionRepository = new SubscriptionRepository();
export default subscriptionRepository;
