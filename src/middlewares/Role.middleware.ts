import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthResponse";
import { UserRoles } from "../constants"; // Use enum Role here
import ApiError from "../utils/apiError";


/**
 * Unified middleware to check both role and scope access.
 */
export const authorizeAccess = (
  roles?: UserRoles[]
) => {
  return (req: AuthRequest, _: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(ApiError.unauthorized("Authentication required."));
    }

    if (roles && !roles.includes(user.role)) {
      return next(ApiError.forbidden("Access denied: Insufficient role."));
    }

    if (user.role === UserRoles.SuperAdmin) {
      return next();
    }

    const tenantId = req.body.tenantId || undefined;
    if (!tenantId || user.tenantId?.toString() !== tenantId) {
      return next(ApiError.forbidden("Access denied: Tenant mismatch."));
    }

    return next();
  };
};



