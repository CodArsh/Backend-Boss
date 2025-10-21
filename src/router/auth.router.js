import { Router } from "express";
import { forgotPassword, login, resendSignupOTP, resetPassword, signupRequest, verifySignupOTP } from "../controller/auth.controller.js";
import { refreshAccessToken } from "../middleware/refreshToken.js";

const AuthRouter = Router()

AuthRouter.post("/signup-request", signupRequest)
AuthRouter.post("/verify-signup", verifySignupOTP)
AuthRouter.post("/resend-otp", resendSignupOTP)
AuthRouter.post("/login", login)
AuthRouter.post("/forgot-password", forgotPassword)
AuthRouter.post("/reset-password/:token", resetPassword)
AuthRouter.post("/refresh", refreshAccessToken)

export default AuthRouter