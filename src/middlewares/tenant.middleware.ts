import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthResponse";
import ApiError from "../utils/apiError";
import { UserRoles } from "../constants";

export const tenantAccess = async (req: AuthRequest, _: Response, next: NextFunction) => {
    if (req.user?.role === UserRoles.SuperAdmin) return next();
    const userTenantId = req.user?.tenantId?.toString();
    const routeTenantId =
        req.params.tenantId || req.body.tenantId || req.params.id;

    if (!userTenantId) {
        return next(ApiError.unauthorized("Tenant information missing in token."));
    }

    if (!routeTenantId) {
        return next(ApiError.badRequest("Missing tenant identifier in request."));
    }

    if (userTenantId !== routeTenantId) {
        return next(ApiError.forbidden("Access denied: Invalid tenant."));
    }

    return next();
};
