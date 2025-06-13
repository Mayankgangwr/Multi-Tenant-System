import mongoose, { FilterQuery, Model, UpdateQuery, Document } from "mongoose";

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
    options: {
      skip?: number;
      limit?: number;
      sort?: any;
      projection?: any;
    } = {}
  ): Promise<T[]> {
    const query = this.model.find(filter, options.projection);

    if (options.skip !== undefined) query.skip(options.skip);
    if (options.limit !== undefined) query.limit(options.limit);
    if (options.sort !== undefined) query.sort(options.sort);

    return await query.exec();
  }

  async update(filter: Record<string, any>, update: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findOneAndUpdate(filter, update, { new: true });
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
