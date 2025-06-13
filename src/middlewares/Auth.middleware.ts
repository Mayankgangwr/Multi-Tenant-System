import { Response, NextFunction } from "express";
import { decodedJWT } from "../utils/jwt";
import configENV from "../config/configENV";
import ApiError from "../utils/apiError";
import userRepository from "../repositories/UserRepository";
import { AuthRequest } from "../types/AuthResponse";

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
    const accessTokenSecret = { secret: String(configENV.ACCESS_TOKEN_SECRET) };

    const decodedToken = await decodedJWT(accessToken, accessTokenSecret);
    if (!decodedToken) throw ApiError.unauthorized("Invalid access token");

    // Find the user from db
    const user = await userRepository.findById(decodedToken.id);
    if (!user) throw ApiError.unauthorized(" Invalid access token!.");
    // Attach user into request
    req.user = user;
    next();
}