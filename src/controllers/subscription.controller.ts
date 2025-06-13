import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import subscriptionService from "../services/subscription.service";
import ApiError from "../utils/apiError";
import { AuthRequest } from "../types/AuthResponse";

export const insertSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
    const subscription = await subscriptionService.create(req.body);
    res.status(201).json({
        statusCode: 201,
        status: true,
        data: subscription,
        message: "Subscription created successfully.",
    });
});

export const updateSubscription = asyncHandler(async (req: Request, res: Response) => {
    const subscriptionId = req.params.id;
    if (!subscriptionId) throw ApiError.badRequest("Subscription ID is required.");

    const subscription = await subscriptionService.update(subscriptionId, req.body);
    res.status(200).json({
        statusCode: 200,
        status: true,
        data: subscription,
        message: "Subscription updated successfully.",
    });
});

export const getSubscriptionById = asyncHandler(async (req: Request, res: Response) => {
    const subscriptionId = req.params.id;
    const subscription = await subscriptionService.getById(subscriptionId);
    res.status(200).json({
        statusCode: 200,
        status: true,
        data: subscription,
        message: "Subscription fetched successfully.",
    });
});

export const getAllSubscriptions = asyncHandler(async (req: Request, res: Response) => {
    const subscriptions = await subscriptionService.getAll(req.query, {
        skip: Number(req.query.skip) || 0,
        limit: Number(req.query.limit) || 20,
    });
    res.status(200).json({
        statusCode: 200,
        status: true,
        data: subscriptions,
        message: "Subscription list fetched successfully.",
    });
});

export const deleteSubscription = asyncHandler(async (req: Request, res: Response) => {
    const subscriptionId = req.params.id;
    const result = await subscriptionService.delete(subscriptionId);
    res.status(200).json({
        statusCode: 200,
        status: result,
        message: "Subscription deleted successfully.",
    });
});

export const hardDeleteSubscription = asyncHandler(async (req: Request, res: Response) => {
    const subscriptionId = req.params.id;
    const result = await subscriptionService.hardDelete(subscriptionId);
    res.status(200).json({
        statusCode: 200,
        status: result,
        message: "Subscription permanently deleted.",
    });
});
