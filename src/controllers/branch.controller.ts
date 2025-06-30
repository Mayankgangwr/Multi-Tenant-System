import { Request, Response } from "express";
import branchService from "../services/branch.service";
import { AuthRequest } from "../types/AuthResponse";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";

export const insertBranch = asyncHandler(async (req: AuthRequest, res: Response) => {
  const branch = await branchService.create(req.body);
  res.status(201).json({ statusCode: 201, status: true, data: branch, message: "Branch created successfully." });
});

export const updateBranch = asyncHandler(async (req: Request, res: Response) => {
  const branchId = req.params.id;
  if (!branchId) throw ApiError.badRequest("Branch ID is required.");

  const branch = await branchService.update(branchId, req.body);
  res.status(200).json({ statusCode: 200, status: true, data: branch, message: "Branch updated successfully." });
});

export const getBranchById = asyncHandler(async (req: Request, res: Response) => {
  const branchId = req.params.id;
  const branch = await branchService.getById(branchId);
  res.status(200).json({ statusCode: 200, status: true, data: branch, message: "Branch fetched successfully." });
});

export const getAllBranches = asyncHandler(async (req: Request, res: Response) => {
  const branches = await branchService.getAll(req.query);
  res.status(200).json({ statusCode: 200, status: true, data: branches, message: "Branch list fetched successfully." });
});

export const deleteBranch = asyncHandler(async (req: Request, res: Response) => {
  const branchId = req.params.id;
  const result = await branchService.delete(branchId);
  res.status(200).json({ statusCode: 200, status: result, message: "Branch deleted successfully." });
});

export const hardDeleteBranch = asyncHandler(async (req: Request, res: Response) => {
  const branchId = req.params.id;
  const result = await branchService.hardDelete(branchId);
  res.status(200).json({ statusCode: 200, status: result, message: "Branch permanently deleted." });
});
