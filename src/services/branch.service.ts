import { Types } from "mongoose";
import { IBranchDocument } from "../models/branch.model";
import branchRepository from "../repositories/branch.repository";
import ApiError from "../utils/apiError";
import { buildBranchFilter } from "../utils/base-filter.util";
import { generatePaginationDto, generatePaginationOptions } from "../utils/pagination.util";

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

  public async getAll(query: Record<string, any>): Promise<IBranchDocument[]> {
    const filterQuery = buildBranchFilter(query);
    const paginationOptions = generatePaginationOptions(query);
    const { skip, limit, sort } = paginationOptions;
    const branches = await branchRepository.model.aggregate([
      { $match: filterQuery },
      {
        $lookup: {
          from: "tenants",
          foreignField: "_id",
          localField: "tenantId",
          as: "organization"
        }
      },
      { $unwind: { path: "$organization", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: 1,
          location: 1,
          contactEmail: 1,
          phoneNumber: 1,
          timeZone: 1,
          isMainBranch: 1,
          holidays: 1,
          staweeklyOfftus: 1,
          isDelete: 1,
          organization: {
            _id: "$organization._id",
            name: "$organization.name",
            email: "$organization.email",
            status: "$organization.status"
          }
        }
      },

      { $sort: sort },
      { $skip: skip },
      { $limit: limit }
    ]);

    if (!branches || branches.length === 0) {
      throw ApiError.notFound("No branches found.");
    }
    return branches;
  }

  public async delete(id: string, tenantId: Types.ObjectId): Promise<boolean> {
    const isDeleted = await branchRepository.delete(id, tenantId);
    if (!isDeleted) throw ApiError.internal("Failed to delete branch.");
    return true;
  }

  public async hardDelete(id: string, tenantId: Types.ObjectId): Promise<boolean> {
    const isDeleted = await branchRepository.hardDelete(id, tenantId);
    if (!isDeleted) throw ApiError.internal("Failed to hard delete branch.");
    return true;
  }
}

const branchService = new BranchService();
export default branchService;
