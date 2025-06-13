// import { redisClient } from "../config/redisConfig";
// import { IUserDocument } from "../models/user.model";
// import userRepository from "../repositories/UserRepository";
// import { IAuthResponse } from "../types/AuthResponse";
// import ApiError from "../utils/apiError";
// import { isPasswordStrong } from "../utils/isPasswordStrong";
// import bcrypt from 'bcryptjs';
// import { decodedJWT } from "../utils/jwt";
// import configENV from "../config/configENV";

// class UserService {
//     private async existingUser(email: string | undefined) {
//         if (!email) throw ApiError.badRequest("User email is required!");

//         const user = await userRepository.findByEmail(email);
//         return user ? true : false;
//     }

//     public async registerUser(data: Partial<IUserDocument>): Promise<IUserDocument> {
//         const isUserExist = await this.existingUser(data.email);
//         if (isUserExist) {
//             throw ApiError.badRequest("User with this email already exists.");
//         }

//         return await userRepository.create(data);
//     }

//     public async loginUser(email: string, password: string): Promise<IAuthResponse> {
//         // Get user with password
//         const user = await userRepository.findByEmailWithSencetiveFields(email);
//         if (!user) throw ApiError.notFound("User not found!");

//         const isMatch = await user.isPasswordCorrect(password);
//         if (!isMatch) throw ApiError.unauthorized("Invalid password!");

//         const accessToken = user.generateAccessToken();
//         const refreshToken = user.generateRefreshToken();

//         // Update login state and token
//         const updatedUser = await userRepository.update(String(user._id), {
//             isLoggedIn: true,
//             refreshToken
//         });

//         if (!updatedUser) throw ApiError.notFound("User not found!.");

//         return {
//             user: updatedUser,
//             accessToken,
//             refreshToken
//         };
//     }

//     public async logoutUser(id: string) {
//         await userRepository.update(id, {
//             isLoggedIn: false,
//             refreshToken: undefined
//         });

//         return true;
//     }

//     public async getUserById(id: string): Promise<IUserDocument | null> {
//         const cacheKey = `profile:${id}`;
//         // Check Redis cache
//         const cachedUser = await redisClient.get(cacheKey);

//         let user = null;
//         if (cachedUser) {
//             user = JSON.parse(cachedUser);
//         }

//         // If not in cache, fetch from DB
//         if (!user) {
//             user = await userRepository.findById(id);
//             if (!user) throw ApiError.notFound("User not found!");

//             // Cache it for 1 hour
//             await redisClient.set(cacheKey, JSON.stringify(user), { EX: 3600 });
//         }

//         return user;
//     }

//     public async updateUser(id: string, user: Partial<IUserDocument>) {
//         const updatedUser = await userRepository.update(id, user);
//         if (!updatedUser) {
//             throw ApiError.internal("There was an issue updating the user.");
//         }
//         return updatedUser;
//     }

//     public async changePassword(id: string, oldPassword: string, newPassword: string) {
//         const user = await userRepository.model.findById(id);
//         if (!user) throw ApiError.notFound("User not found with the provided ID.");

//         const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
//         if (!isPasswordCorrect) throw ApiError.badRequest("The old password is incorrect.");

//         if (!isPasswordStrong(newPassword)) {
//             throw ApiError.badRequest("Password must be at least 8 characters long and include uppercase, lowercase, and a number.");
//         }

//         const isSameAsOld = await bcrypt.compare(newPassword, user.password);
//         if (isSameAsOld) throw ApiError.badRequest("New password must be different from the old password.");

//         user.password = newPassword;

//         await user.save({ validateBeforeSave: false });
//         return { success: true };
//     }

//     public async refreshTokens(incomingRefreshToken: string) {
//         const decodedToken = await decodedJWT(incomingRefreshToken, configENV.REFRESH_TOKEN_SECRET);

//         if (!decodedToken) throw ApiError.badRequest("Invalid refresh token!.");

//         const user = await userRepository.model.findById(decodedToken._id);
//         if (!user) throw ApiError.notFound("User not found!.");

//         if (incomingRefreshToken !== user.refreshToken) {
//             throw ApiError.unauthorized("Refresh token is expired or invalid.");
//         }

//         const accessToken = user.generateAccessToken();
//         const refreshToken = user.generateRefreshToken();

//         user.refreshToken = refreshToken;

//         await user.save({ validateBeforeSave: false });

//         return {
//             accessToken,
//             refreshToken
//         }
//     }
// }

// const userService = new UserService();
// export default userService;