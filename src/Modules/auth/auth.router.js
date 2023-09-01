import { Router } from "express";
import * as validator from "./auth.validation.js";
import { isValid } from "../../Middleware/validation.middleware.js";
import * as authController from "./controller/user.js";
const router =Router()

//Register
router.post("/register" , isValid(validator.registerSchema) ,authController.register)

//Activate Account
router.get("/confirmEmail/:activationCode", isValid(validator.activateSchema),authController.activateAccount)

// //Login
router.post("/login",isValid(validator.loginSchema),authController.login)

//send forget password code
router.patch("/forgetcode" , isValid(validator.forgetCodeSchema),authController.sendForgetCode)

//Reset Password
router.patch("/resetpassword",isValid(validator.resetPasswordSchema) ,authController.resetPassword)

export default router