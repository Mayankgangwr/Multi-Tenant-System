import { Response } from "express"
import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../types/AuthResponse";
import userService from "../services/user.service";
import { options } from "../constants";
import ApiError from "../utils/apiError";

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await userService.create(req.body);
    res.status(201).json({ statusCode: 201, data: user, status: true, message: "User registered successfully!." })
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await userService.loginUser(email, password);

    res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json({ statusCode: 200, data: { user, accessToken, refreshToken }, status: true, message: "User loggedin successfully!." });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId: string | undefined = req.user?._id?.toString();
    if (!userId) throw ApiError.unauthorized("Unauthorized: User authentication is required to perform this action.");

    await userService.logoutUser(userId);

    res.status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json({ statusCode: 200, status: true, message: "User logout successfully!." });
});