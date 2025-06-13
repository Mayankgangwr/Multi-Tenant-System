import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { ISubscriptionDocument, SubscriptionModel } from "../models/subscription.model";

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
        options: {
            skip?: number;
            limit?: number;
            sort?: any;
            projection?: any;
        } = {}
    ): Promise<ISubscriptionDocument[]> {
        const query = this.model.find(filter, options.projection);

        if (options.skip !== undefined) query.skip(options.skip);
        if (options.limit !== undefined) query.limit(options.limit);
        if (options.sort !== undefined) query.sort(options.sort);

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
