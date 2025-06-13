import { Router } from "express";
import { deleteTenant, getAllTenants, getSingleTenant, getTenantById, hardDeleteTenant, insertTenant, updateTenant } from "../controllers/tenant.controller";
import { validate } from "../middlewares/Validate.middleware";
import { createTenantSchema, updateTenantSchema } from "../validators/tenant.schema";
import { verifyToken } from "../middlewares/Auth.middleware";
import { idParamSchema } from "../validators/IdParam.schema";
import { UserRoles } from "../constants";
import { tenantAccess } from "../middlewares/tenant.middleware";

const router = Router();

router.post("/",
    verifyToken,
    tenantAccess([UserRoles.SuperAdmin]),
    validate({ body: createTenantSchema }),
    insertTenant
);

router.get("/",
    verifyToken,
    tenantAccess([UserRoles.SuperAdmin]),
    getSingleTenant);

router.get("/list",
    verifyToken,
    tenantAccess([UserRoles.SuperAdmin]),
    getAllTenants);

router.get("/:id",
    verifyToken,
    tenantAccess([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    validate({ params: idParamSchema }),
    getTenantById);

router.patch("/:id",
    verifyToken,
    tenantAccess([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    validate({ body: updateTenantSchema, params: idParamSchema }),
    updateTenant);

router.get("/:id",
    verifyToken,
    tenantAccess([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    validate({ params: idParamSchema }),
    deleteTenant);

router.get("/:id/hard",
    verifyToken,
    tenantAccess([UserRoles.SuperAdmin]),
    validate({ params: idParamSchema }),
    hardDeleteTenant);

export default router;