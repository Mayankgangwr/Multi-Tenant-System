import { Router } from "express";
import { verifyToken } from "../middlewares/Auth.middleware";
import { validate } from "../middlewares/Validate.middleware";
import { registerSchema } from "../validators/user.schemas";
import { UserRoles } from "../constants";
import { login, logout, register } from "../controllers/user.controller";
import { validateUserCreation } from "../middlewares/user.middleware";
import { authorizeRoles } from "../middlewares/Role.middleware";

const router = Router();

// User registration route with RBAC enforcement

router.post(
    "/register",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager]),
    validateUserCreation,
    validate({ body: registerSchema }),
    register
);

// Public login route
router.post("/login", login);

// Authenticated logout
router.post("/logout", verifyToken, logout);

export default router;

//
// router.get("/:id",
//     validate({ params: idParamSchema }),
//     verifyToken,
//     UserAccess([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager, UserRoles.Teacher, UserRoles.Student]),
//     getProfile
// );
// router.patch("/:id",
//     verifyToken,
//     UserAccess([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager, UserRoles.Teacher, UserRoles.Student]),
//     validate({ body: updateUserSchema, params: idParamSchema }),
//     updateUser
// );
// router.put("/change-password", validate({ body: changePasswordSchema }), verifyToken, changeCurrentPassword);
// router.post("/refresh-token", refreshAccessToken);





