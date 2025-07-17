import { Router } from "express";
import { verifyToken } from "../middlewares/Auth.middleware";
import { deleteBranch, getAllBranches, getBranchById, getMyAllBranches, hardDeleteBranch, insertBranch, updateBranch } from "../controllers/branch.controller";
import { Roles, UserRoles } from "../constants";
import { authorizeRoles } from "../middlewares/Role.middleware";
import { tenantAccess } from "../middlewares/tenant.middleware";
import { validate } from "../middlewares/Validate.middleware";
import { createBranchSchema, updateBranchSchema } from "../validators/branch.schema";
import { idParamSchema } from "../validators/IdParam.schema";
import { getBranchBatches } from "../controllers/batch.controller";

const router = Router();

router.post("",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    tenantAccess,
    validate({ body: createBranchSchema }),
    insertBranch
);

router.get("/",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin]),
    getAllBranches
);

router.get("/my",
    verifyToken,
    authorizeRoles([UserRoles.TenantAdmin]),
    getMyAllBranches
);

router.get("/:tenantId/",
    validate({ params: idParamSchema(`tenantId`) }),
    getAllBranches
);



router.patch("/:id",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager]),
    tenantAccess,
    validate({ body: updateBranchSchema, params: idParamSchema() }),
    updateBranch
);

router.get("/:id",
    validate({ params: idParamSchema() }),
    getBranchById
);

router.delete("/:id",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    validate({ params: idParamSchema() }),
    deleteBranch
);

router.delete("/:id/hard",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin]),
    validate({ params: idParamSchema() }),
    hardDeleteBranch
);

router.get("/:branchId/batches",
    validate({ params: idParamSchema(`branchId`) }),
    getBranchBatches
)
export default router