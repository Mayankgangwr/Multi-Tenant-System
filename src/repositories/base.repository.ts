import mongoose, { FilterQuery, Model, UpdateQuery, Document, Types } from "mongoose";
import { IPaginationOptions, IPaginationOptionsDTO } from "../types/comman";
import generatePagination from "../utils/pagination.util";

export default class BaseRepository<T extends Document> {
  model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id); // no select
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter);
  }

  async findAll(
    filter: FilterQuery<T> = {},
    options: IPaginationOptionsDTO = {}
  ): Promise<T[]> {

    const paginationOptions: IPaginationOptions<T> = generatePagination(options);
    const { skip, limit, sort, projection } = paginationOptions;
    const query = this.model.find(filter, projection);

    query.skip(skip);
    query.limit(limit);
    query.sort(sort);
    return await query.exec();
  }

  async update(filter: Record<string, any>, update: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findOneAndUpdate(filter, update, { new: true });
  }

  async delete(id: string, tenantId: Types.ObjectId): Promise<boolean> {
    const docId = new mongoose.Types.ObjectId(id);
    const result = await this.model.updateOne({ _id: docId, tenantId: tenantId }, { isDelete: true }, { new: true })
    return !!result;
  }

  async hardDelete(id: string, tenantId: Types.ObjectId): Promise<boolean> {
    const docId = new mongoose.Types.ObjectId(id);
    const result = await this.model.deleteOne({ _id: docId, tenantId: tenantId })
    return !!result;
  }
}
