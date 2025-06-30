import { Router } from "express";
import { deleteTenant, getAllTenants, getSingleTenant, getTenantById, hardDeleteTenant, insertTenant, updateTenant } from "../controllers/tenant.controller";
import { validate } from "../middlewares/Validate.middleware";
import { createTenantSchema, updateTenantSchema } from "../validators/tenant.schema";
import { verifyToken } from "../middlewares/Auth.middleware";
import { idParamSchema } from "../validators/IdParam.schema";
import { UserRoles } from "../constants";
import { authorizeRoles } from "../middlewares/Role.middleware";
import { tenantAccess } from "../middlewares/tenant.middleware";

const router = Router();

router.post("/",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin]),
    validate({ body: createTenantSchema }),
    insertTenant
);

router.get("/",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin]),
    getAllTenants);

router.get("/:id",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    tenantAccess,
    validate({ params: idParamSchema }),
    getTenantById);

router.patch("/:id",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    tenantAccess,
    validate({ body: updateTenantSchema, params: idParamSchema }),
    updateTenant);

router.get("/:id",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    tenantAccess,
    validate({ params: idParamSchema }),
    deleteTenant);

router.get("/:id/hard",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin]),
    validate({ params: idParamSchema }),
    hardDeleteTenant);

export default router;