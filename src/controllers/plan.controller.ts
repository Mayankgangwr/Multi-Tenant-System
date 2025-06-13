import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import planService from "../services/plan.service";
import ApiError from "../utils/apiError";
import { AuthRequest } from "../types/AuthResponse";

export const insertPlan = asyncHandler(async (req: AuthRequest, res: Response) => {
    const plan = await planService.create(req.body);
    res.status(201).json({ statusCode: 201, status: true, data: plan, message: "Plan created successfully." });
});

export const updatePlan = asyncHandler(async (req: Request, res: Response) => {
    const planId = req.params.id;
    if (!planId) throw ApiError.badRequest("Plan ID is required.");

    const plan = await planService.update(planId, req.body);
    res.status(200).json({ statusCode: 200, status: true, data: plan, message: "Plan updated successfully." });
});

export const getPlanById = asyncHandler(async (req: Request, res: Response) => {
    const planId = req.params.id;
    const plan = await planService.getById(planId);
    res.status(200).json({ statusCode: 200, status: true, data: plan, message: "Plan fetched successfully." });
});

export const getAllPlans = asyncHandler(async (req: Request, res: Response) => {
    const plans = await planService.getAll(req.query);
    res.status(200).json({ statusCode: 200, status: true, data: plans, message: "Plan list fetched successfully." });
});

export const deletePlan = asyncHandler(async (req: Request, res: Response) => {
    const planId = req.params.id;
    const result = await planService.delete(planId);
    res.status(200).json({ statusCode: 200, status: result, message: "Plan deleted successfully." });
});

export const hardDeletePlan = asyncHandler(async (req: Request, res: Response) => {
    const planId = req.params.id;
    const result = await planService.hardDelete(planId);
    res.status(200).json({ statusCode: 200, status: result, message: "Plan permanently deleted." });
});
