import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import batchService from "../services/batch.service";
import ApiError from "../utils/apiError";
import { AuthRequest } from "../types/AuthResponse";

export const insertBatch = asyncHandler(async (req: AuthRequest, res: Response) => {
    const batch = await batchService.create(req.body);
    res
        .status(201)
        .json({ statusCode: 201, status: true, data: batch, message: "Batch created successfully." });
});

export const updateBatch = asyncHandler(async (req: Request, res: Response) => {
    const batchId = req.params.id;
    if (!batchId) throw ApiError.badRequest("Batch ID is required.");

    const batch = await batchService.update(batchId, req.body);
    res
        .status(200)
        .json({ statusCode: 200, status: true, data: batch, message: "Batch updated successfully." });
});

export const getBatchById = asyncHandler(async (req: Request, res: Response) => {
    const batchId = req.params.id;
    const batch = await batchService.getById(batchId);
    res
        .status(200)
        .json({ statusCode: 200, status: true, data: batch, message: "Batch fetched successfully." });
});

export const getAllBatches = asyncHandler(async (req: Request, res: Response) => {
    const batches = await batchService.getAll(req.query);
    res.status(200)
        .json({ statusCode: 200, status: true, data: batches, message: "Batch list fetched successfully." });
});

export const getAllTenantBatches = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.params.tenantId;
    if (!tenantId) throw ApiError.badRequest('Organization id missing.');
    const batches = await batchService.getAll({ ...req.query, tenantId });
    res.status(200)
        .json({ statusCode: 200, status: true, data: batches, message: "Batch list fetched successfully." });
});

export const deleteBatch = asyncHandler(async (req: AuthRequest, res: Response) => {
    const batchId = req.params.id;
    const tenantId = req.user?.tenantId
    if (!tenantId) throw ApiError.unauthorized("Tenant id is required.");
    const result = await batchService.delete(batchId, tenantId);
    res
        .status(200)
        .json({ statusCode: 200, status: result, message: "Batch deleted successfully." });
});

export const hardDeleteBatch = asyncHandler(async (req: AuthRequest, res: Response) => {
    const batchId = req.params.id;
    const tenantId = req.user?.tenantId
    if (!tenantId) throw ApiError.unauthorized("Tenant id is required.");
    const result = await batchService.hardDelete(batchId, tenantId);
    res
        .status(200)
        .json({ statusCode: 200, status: result, message: "Batch permanently deleted." });
});
