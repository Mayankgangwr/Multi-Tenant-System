import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import tenantService from "../services/tenant.service";
import ApiError from "../utils/apiError";
import { AuthRequest } from "../types/AuthResponse";
import { primaryFilter } from "../utils/base-filter.util";

export const insertTenant = asyncHandler(async (req: AuthRequest, res: Response) => {
    const tenant = await tenantService.create(req.body);
    res.status(201).json({ statusCode: 201, status: true, data: tenant, message: "Tenant inserted successfully." });
});

export const updateTenant = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.params.id;
    if (!tenantId) throw ApiError.badRequest("Tenant id is required.");

    const tenant = await tenantService.update(tenantId, req.body);
    res.status(200).json({ statusCode: 200, status: true, data: tenant, message: "Tenant updated successfully." })
});

export const getTenantById = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.params.id;
    const tenant = await tenantService.getById(tenantId);
    res.status(200).json({ statusCode: 200, status: true, data: tenant, message: "Tenant fetched successfully." });
});

export const getSingleTenant = asyncHandler(async (req: Request, res: Response) => {
    const tenant = await tenantService.getOne(req.query);
    res.status(200).json({ statusCode: 200, status: true, data: tenant, message: "Tenant fetched successfully." });
});

export const getAllTenants = asyncHandler(async (req: Request, res: Response) => {
    const tenants = await tenantService.getAll(req.query);
    res.status(200).json({ statusCode: 200, status: true, data: tenants, message: "Tenant lists fetched successfully." });
});

export const deleteTenant = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.params.id;
    const tenant = await tenantService.delete(tenantId);
    res.status(200).json({ statusCode: 200, status: tenant, message: "Tenant deleted successfully." });
});

export const hardDeleteTenant = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.params.id;
    const tenant = await tenantService.hardDelete(tenantId);
    res.status(200).json({ statusCode: 200, status: tenant, message: "Tenant deleted successfully." });
});

