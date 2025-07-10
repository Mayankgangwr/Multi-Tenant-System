import { Router } from "express";
import {
    insertBatch,
    updateBatch,
    getBatchById,
    getAllBatches,
    deleteBatch,
    hardDeleteBatch,
    getAllTenantBatches,
} from "../controllers/batch.controller";
import { verifyToken } from "../middlewares/Auth.middleware";
import { validate } from "../middlewares/Validate.middleware";
import { idParamSchema } from "../validators/IdParam.schema";
import { createBatchSchema, updateBatchSchema } from "../validators/batch.schema";
import { UserRoles } from "../constants";
import { authorizeRoles } from "../middlewares/Role.middleware";
import { tenantAccess } from "../middlewares/tenant.middleware";
import { getBatchEnrollments } from "../controllers/enrollment.controller";

const router = Router();

router.post(
    "/",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager]),
    tenantAccess,
    validate({ body: createBatchSchema }),
    insertBatch
);

router.get("/",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin]),
    getAllBatches);

router.get("/:tenantId",
    validate({ params: idParamSchema(`tenantId`) }),
    getAllTenantBatches
);

router.get(
    "/:id",
    validate({ params: idParamSchema() }),
    getBatchById
);

router.patch(
    "/:id",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager]),
    tenantAccess,
    validate({ body: updateBatchSchema, params: idParamSchema() }),
    updateBatch
);

router.delete(
    "/:id",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager]),
    tenantAccess,
    validate({ params: idParamSchema() }),
    deleteBatch
);

router.delete(
    "/:id/hard",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin]),
    validate({ params: idParamSchema() }),
    hardDeleteBatch
);

router.get(
    "/:batchId/students",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager]),
    tenantAccess,
    validate({ params: idParamSchema(`batchId`) }),
    getBatchEnrollments
);


export default router;
