import { Router } from "express";
import { isAuthenticated } from "../../Middleware/authuntication.middleware.js";
import { isAuthorized } from "../../Middleware/authorization.middleware.js";
import { isValid } from "../../Middleware/validation.middleware.js";
import * as validator from "./coupon.validation.js"
import * as controllerCategory from "./controller/coupon.js"

const router =Router();

// create coupon

router.post("/",isAuthenticated,
isAuthorized("admin"),
isValid(validator.createCouponSchema),
controllerCategory.createCoupon)


// update coupon


router.patch("/:code",
isAuthenticated,
isAuthorized("admin"),
isValid(validator.updateCouponSchema),
controllerCategory.updateCoupon)


// delete coupon

router.delete("/:code",
isAuthenticated,
isAuthorized("admin"),
isValid(validator.deleteCouponSchema),
controllerCategory.deleteCoupon)

router.get("/" ,controllerCategory.allCoupon)

export default router