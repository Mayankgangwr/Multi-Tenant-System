import { Router } from "express";
// import { register, login, getProfile, logout, updateUser, changeCurrentPassword, refreshAccessToken } from "../controllers/UserController";
import { verifyToken } from "../middlewares/Auth.middleware";
import { validate } from "../middlewares/Validate.middleware";
import { changePasswordSchema, registerSchema, updateUserSchema } from "../validators/user.schemas";
import { idParamSchema } from "../validators/IdParam.schema";
import { UserRoles } from "../constants";
import { login, register } from "../controllers/user.controller";
import { userAccess } from "../middlewares/user.middleware";

const router = Router();

router.post("/register",
    verifyToken,
    userAccess([UserRoles.SuperAdmin, UserRoles.SuperAdmin, UserRoles.BranchManager]),
    validate({ body: registerSchema }),
    register);

    router.post("/login", login);


// 
// router.post("/logout", verifyToken, logout)
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

export default router;



