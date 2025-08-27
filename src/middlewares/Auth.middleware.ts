import { Response, NextFunction } from "express";
import { decodedJWT } from "../utils/jwt";
import configENV from "../config/env.config";
import ApiError from "../utils/apiError";
import { AuthRequest } from "../types/AuthResponse";
import userRepository from "../repositories/user.repository";

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace(/^Bearer\s*/, "");
    if (accessToken) accessToken = accessToken.trim();

    const accessTokenSecret = { secret: String(configENV.accessTokenSecret) };

    const decodedToken = await decodedJWT(accessToken, accessTokenSecret);
    if (!decodedToken) throw ApiError.unauthorized("Invalid access token");

    // Find the user from db
    const user = await userRepository.findById(decodedToken.id);
    if (!user) throw ApiError.unauthorized(" Invalid access token!.");
    // Attach user into request
    req.user = user;
    next();
}