// import { Request, Response, NextFunction } from "express";
// import userService from "../services/UserService";
// import ApiError from "../utils/apiError";
// import { options } from "../constants";
// import { AuthRequest } from "../types/AuthResponse";
// import { asyncHandler } from "../utils/asyncHandler";

// export const register = asyncHandler(async (req: Request, res: Response) => {
//     const user = await userService.registerUser(req.body);
//     res.status(201).json({ statusCode: 201, data: user, status: true, message: "User registered successfully!." })
// });

// export const login = asyncHandler(async (req: Request, res: Response) => {
//     const { email, password } = req.body;
//     const { user, accessToken, refreshToken } = await userService.loginUser(email, password);

//     res.status(200)
//         .cookie("refreshToken", refreshToken, options)
//         .cookie("accessToken", accessToken, options)
//         .json({ statusCode: 200, data: { user, accessToken, refreshToken }, status: true, message: "User loggedin successfully!." });
// });

// export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
//     const userId = req.user?._id;
//     if (!userId) throw ApiError.unauthorized("Unauthorized: User authentication is required to perform this action.");

//     await userService.logoutUser(userId);

//     res.status(200)
//         .clearCookie("refreshToken", options)
//         .clearCookie("accessToken", options)
//         .json({ statusCode: 200, status: true, message: "User logout successfully!." });
// });

// export const getProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
//     const userId = req.user?._id;
//     if (!userId) throw ApiError.unauthorized("Unauthorized: User authentication is required to perform this action.");
//     const user = await userService.getUserById(userId);
//     if (!user) throw ApiError.notFound("User not found!");

//     res.status(200).json({ statusCode: 200, data: user, status: true, message: "User profile fetched successfully!." });
// });

// export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
//     const userId = req.params.id;
//     if (!userId) throw ApiError.badRequest("User id is required!.");

//     const user = await userService.updateUser(userId, req.body);
//     res.status(200).json({ statusCode: 200, data: user, status: true, message: "User details updated successfully!." });
// });

// export const changeCurrentPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
//     const userId = req.user?._id;
//     if (!userId) throw ApiError.unauthorized("Unauthorized: User authentication is required to perform this action.");

//     const { oldPassword, newPassword } = req.body;

//     if (!oldPassword || !newPassword) {
//         throw ApiError.badRequest("Both old and new passwords are required.");
//     }

//     await userService.changePassword(userId, oldPassword, newPassword);

//     res.status(200).json({
//         statusCode: 200,
//         status: true,
//         message: "Password changed successfully."
//     });
// });

// export const refreshAccessToken = asyncHandler(async (req: AuthRequest, res: Response) => {
//     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
//     if (!incomingRefreshToken) throw ApiError.unauthorized("Unauthorized request!.");

//     const { accessToken, refreshToken } = await userService.refreshTokens(incomingRefreshToken);
//     if (!accessToken || !refreshToken) throw ApiError.internal("Failed to generate token!.");

//     res.status(200)
//         .cookie("refreshToken", refreshToken, options)
//         .cookie("accessToken", accessToken, options)
//         .json({ statusCode: 200, data: { accessToken, refreshToken }, status: true, message: "Access token has been refreshed successfully!." });
// });