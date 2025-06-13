import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthResponse";
import { UserRoles } from "../constants";
import ApiError from "../utils/apiError";
import tenantRepository from "../repositories/tenant.repository"; // Assumes a findById method exists

export const tenantAccess = (roles?: UserRoles[]) => {
    return async (req: AuthRequest, _: Response, next: NextFunction) => {
        const user = req.user;
        const tenantId = req.params.tenantId || req.params.id || req.body.tenantId;

        if (!user) {
            return next(ApiError.unauthorized("Authentication required."));
        }

        if (roles && !roles.includes(user.role)) {
            return next(ApiError.forbidden("Access denied: Role not permitted."));
        }


        if (
            user.role === UserRoles.SuperAdmin ||
            (user.role === UserRoles.TenantAdmin && user.tenantId && user.tenantId.toString() === tenantId.toString())
        ) {
            return next();
        }

        return next(ApiError.forbidden("Access denied: Tenant or role mismatch."));
    };
};
