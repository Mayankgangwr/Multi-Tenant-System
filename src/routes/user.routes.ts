import { Router } from "express";
import { verifyToken } from "../middlewares/Auth.middleware";
import { validate } from "../middlewares/Validate.middleware";
import { changePasswordSchema, registerSchema, updateUserSchema } from "../validators/user.schemas";
import { UserRoles } from "../constants";
import { changeCurrentPassword, getCurrentUser, login, logout, refreshAccessToken, register, updateUserDetails } from "../controllers/user.controller";
import { validateUserCreation, validateUserUpdateAccess } from "../middlewares/user.middleware";
import { authorizeRoles } from "../middlewares/Role.middleware";
import { tenantAccess } from "../middlewares/tenant.middleware";
import { idParamSchema } from "../validators/IdParam.schema";

const router = Router();

// User registration route with RBAC enforcement

router.route("/register").post(
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager]),
    validateUserCreation,
    validate({ body: registerSchema }),
    register
);

router.route("/login").post(login);

router.route("/logout").post(verifyToken, logout);

router.route("/refresh-token").post(refreshAccessToken);

router.put("/change-password", verifyToken, validate({ body: changePasswordSchema }), changeCurrentPassword);

router.route('/me').get(verifyToken, getCurrentUser);

router.route('/:id').patch(
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager, UserRoles.Teacher, UserRoles.Student]),
    tenantAccess,
    validateUserUpdateAccess,
    validate({ body: updateUserSchema, params: idParamSchema() }),
    updateUserDetails
);


export default router;

//
// router.get("/:id",
//     validate({ params: idParamSchema() }),
//     verifyToken,
//     UserAccess([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager, UserRoles.Teacher, UserRoles.Student]),
//     getProfile
// );
// router.patch("/:id",
//     verifyToken,
//     UserAccess([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager, UserRoles.Teacher, UserRoles.Student]),
//     validate({ body: updateUserSchema, params: idParamSchema() }),
//     updateUser
// );






