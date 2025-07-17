import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthResponse";
import { UserRoles } from "../constants";
import ApiError from "../utils/apiError";
import userRepository from "../repositories/user.repository";
import { Types } from "mongoose";

export const userAccessControl = (options: {
  allowedRoles?: UserRoles[];
  matchTenant?: boolean;
  matchBranch?: boolean;
  allowSelf?: boolean;
}) => {
  return (req: AuthRequest, _: Response, next: NextFunction) => {
    const user = req.user;
    const {
      allowedRoles = [],
      matchTenant = false,
      matchBranch = false,
      allowSelf = false,
    } = options;

    if (!user) {
      return next(ApiError.unauthorized("Authentication required."));
    }

    // SuperAdmin bypasses all checks
    if (user.role === UserRoles.SuperAdmin) return next();

    // Check allowed role
    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      return next(ApiError.forbidden("Access denied: Role not permitted."));
    }

    // Self-access check
    const targetUserId = req.params.id || req.body.id;
    if (allowSelf && targetUserId && user?._id?.toString() === targetUserId.toString()) {
      return next();
    }

    // Tenant match check
    const routeTenantId = req.params.tenantId || req.body.tenantId;
    if (matchTenant && user.tenantId?.toString() !== routeTenantId?.toString()) {
      return next(ApiError.forbidden("Access denied: Cross-tenant access is not allowed."));
    }

    // Branch match check
    const routeBranchId = req.params.branchId || req.body.branchId;
    if (matchBranch && user.branchId?.toString() !== routeBranchId?.toString()) {
      return next(ApiError.forbidden("Access denied: Cross-branch access is not allowed."));
    }

    return next();
  };
};

export const validateUserCreation = (req: AuthRequest, res: Response, next: NextFunction) => {
  const currentUser = req.user;
  const { role: newUserRole } = req.body;

  if (!currentUser) {
    return next(ApiError.unauthorized("Unauthorized"));
  }

  // SuperAdmin can do anything
  if (currentUser.role === UserRoles.SuperAdmin) return next();

  // TenantAdmin creating a user
  if (currentUser.role === UserRoles.TenantAdmin) {
    if (![UserRoles.BranchManager, UserRoles.Teacher, UserRoles.Student].includes(newUserRole)) {
      return next(ApiError.forbidden("TenantAdmin can only create BranchManager, Teacher or Student"));
    }

    req.body.tenantId = currentUser.tenantId?.toString();

    // If trying to set branch, make sure it belongs to the tenant (optional: validate against DB here)

    return next();
  }

  // BranchManager creating a user
  if (currentUser.role === UserRoles.BranchManager) {
    if (![UserRoles.Teacher, UserRoles.Student].includes(newUserRole)) {
      return next(ApiError.forbidden("BranchManager can only create Teacher or Student"));
    }

    // Force tenantId and branchId
    req.body.tenantId = currentUser.tenantId?.toString();
    req.body.branchId = currentUser.branchId?.toString();

    return next();
  }

  // All other roles cannot create users
  return next(ApiError.forbidden("You are not authorized to create users"));
};


export const validateUserUpdateAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const loggedInUser = req.user;
  const targetUserId = req.params.id;


  if (!loggedInUser || !targetUserId) {
    return next(ApiError.unauthorized("Unauthorized access."));
  }

  const isSameUser = loggedInUser._id.equals(targetUserId);
  if (isSameUser) return next();
  const targetUser = await userRepository.findById(targetUserId);
  if (!targetUser) {
    return next(ApiError.notFound("Target user not found."));
  }

  switch (loggedInUser.role) {
    case UserRoles.SuperAdmin:
      return next(); // Allow everything

    case UserRoles.TenantAdmin:
      if (loggedInUser.tenantId === targetUser.tenantId) return next();
      break;

    case UserRoles.BranchManager:
      if (
        loggedInUser.branchId === targetUser.branchId &&
        [UserRoles.Teacher, UserRoles.Student].includes(targetUser.role)
      ) {
        return next();
      }
      break;

    case UserRoles.Teacher:
    case UserRoles.Student:
      if (isSameUser) return next();
      break;
  }

  return next(ApiError.forbidden("You are not authorized to update this user."));
};

