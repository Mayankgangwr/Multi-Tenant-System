import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthResponse";
import { UserRoles } from "../constants";
import ApiError from "../utils/apiError";

export const userAccess = (allowedRoles?: UserRoles[]) => {
  return async (req: AuthRequest, _: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return next(ApiError.unauthorized("Authentication required."));
    }

    // Optional global role filter
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return next(ApiError.forbidden("Access denied: Role not permitted."));
    }

    const targetUserId = req.body.id || req.params.id;
    const targetTenantId = req.body.tenantId || req.params.tenantId;
    const targetRole = req.body.role;

    // 1. SuperAdmin has full access
    if (user.role === UserRoles.SuperAdmin) {
      return next();
    }

    // 2. Self-access allowed for all roles
    if (user._id === targetUserId) {
      return next();
    }

    // 3. TenantAdmin: only within same tenant
    if (
      user.role === UserRoles.TenantAdmin &&
      user.tenantId === targetTenantId
    ) {
      return next();
    }

    // 4. BranchManager: only within same tenant & limited roles
    const canManageRole = [UserRoles.Teacher, UserRoles.Student];
    if (
      user.role === UserRoles.BranchManager &&
      user.tenantId === targetTenantId &&
      canManageRole.includes(targetRole)
    ) {
      return next();
    }

    // 5. Teacher or Student trying to access others - forbidden
    return next(
      ApiError.forbidden("Access denied: You are not authorized to perform this action.")
    );
  };
};
