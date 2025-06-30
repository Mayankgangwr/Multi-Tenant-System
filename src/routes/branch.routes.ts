import { Router } from "express";
import { verifyToken } from "../middlewares/Auth.middleware";
import { deleteBranch, getAllBranches, getBranchById, hardDeleteBranch, insertBranch, updateBranch } from "../controllers/branch.controller";
import { Roles, UserRoles } from "../constants";
import { authorizeRoles } from "../middlewares/Role.middleware";
import { tenantAccess } from "../middlewares/tenant.middleware";

const router = Router();

router.post("",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    tenantAccess,
    insertBranch
);

router.get("/",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin]),
    getAllBranches
);

router.put("/:id",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager]),
    tenantAccess,
    updateBranch
);

router.get("/:id",
    getBranchById
);

router.delete("/:id",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager]),
    tenantAccess,
    deleteBranch
);

router.delete("/:id/hard",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin]),
    hardDeleteBranch
);
export default router