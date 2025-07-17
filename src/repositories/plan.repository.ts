import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { IPlanDocument, PlanModel } from "../models/plan.model";
import { IPaginationOptions, IPaginationOptionsDTO } from "../types/comman";
import generatePagination from "../utils/pagination.util";

class PlanRepository {
    model: Model<IPlanDocument>;
    constructor() {
        this.model = PlanModel;
    }

    async create(data: Partial<IPlanDocument>): Promise<IPlanDocument> {
        return await this.model.create(data);
    }

    async findById(id: string): Promise<IPlanDocument | null> {
        return await this.model.findById(id); // no select
    }

    async findAll(
        filter: FilterQuery<IPlanDocument> = {},
        options: IPaginationOptionsDTO = {}
    ): Promise<IPlanDocument[]> {

        const paginationOptions: IPaginationOptions<IPlanDocument> = generatePagination(options);
        const { skip, limit, sort, projection } = paginationOptions;
        const query = this.model.find(filter, projection);

        query.skip(skip);
        query.limit(limit);
        query.sort(sort);
        return await query.exec();
    }
    
    async update(id: string, update: UpdateQuery<IPlanDocument>): Promise<IPlanDocument | null> {
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

const planRepository = new PlanRepository();
export default planRepository;