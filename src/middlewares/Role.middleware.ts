import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthResponse";
import { UserRoles } from "../constants"; // Use enum Role here
import ApiError from "../utils/apiError";


/**
 * Unified middleware to check role access.
 */
export const authorizeRoles = (
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

    return next();
  };
};



