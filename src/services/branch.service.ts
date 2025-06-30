import { IBranchDocument } from "../models/branch.model";
import branchRepository from "../repositories/branch.repository";
import ApiError from "../utils/apiError";
import { buildBranchFilter } from "../utils/base-filter.util";

class BranchService {
  public async create(data: Partial<IBranchDocument>): Promise<IBranchDocument> {
    const existingBranch = await branchRepository.model.findOne({
      name: data.name,
      tenantId: data.tenantId,
      deletedAt: { $exists: false },
    });

    if (existingBranch) {
      throw ApiError.badRequest("Branch with the same name already exists for this tenant.");
    }

    const branch = await branchRepository.create(data);
    if (!branch) throw ApiError.internal("Failed to create new branch.");
    return branch;
  }

  public async update(branchId: string, data: Partial<IBranchDocument>): Promise<IBranchDocument> {
    const existingBranch = await branchRepository.model.findOne({
      _id: { $ne: branchId },
      name: data.name,
      tenantId: data.tenantId,
      deletedAt: { $exists: false },
    });

    if (existingBranch) {
      throw ApiError.badRequest("Another branch with the same name already exists for this tenant.");
    }

    const branch = await branchRepository.model.findByIdAndUpdate(branchId, data, { new: true });
    if (!branch) throw ApiError.notFound(`No branch found with ID "${branchId}".`);
    return branch;
  }

  public async getById(branchId: string): Promise<IBranchDocument> {
    const branch = await branchRepository.findById(branchId);
    if (!branch) throw ApiError.notFound(`No branch found with ID "${branchId}".`);
    return branch;
  }

  public async getAll(filter: Record<string, any>): Promise<IBranchDocument[]> {
    const filterQuery = buildBranchFilter(filter);
    const branches = await branchRepository.findAll(filterQuery);
    if (!branches || branches.length === 0) {
      throw ApiError.notFound("No branches found.");
    }
    return branches;
  }

  public async delete(id: string): Promise<boolean> {
    const isDeleted = await branchRepository.delete(id);
    if (!isDeleted) throw ApiError.internal("Failed to delete branch.");
    return true;
  }

  public async hardDelete(id: string): Promise<boolean> {
    const isDeleted = await branchRepository.hardDelete(id);
    if (!isDeleted) throw ApiError.internal("Failed to hard delete branch.");
    return true;
  }
}

const branchService = new BranchService();
export default branchService;
