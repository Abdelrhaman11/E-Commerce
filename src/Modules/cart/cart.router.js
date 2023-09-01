import { Router } from "express";
import { isAuthenticated } from "../../Middleware/authuntication.middleware.js";
import { isValid } from "../../Middleware/validation.middleware.js";
import * as validator from "./cart.validation.js" 
import * as controllerCart from "./controller/cart.js"

const router=Router()
// addToCart
router.post("/",isAuthenticated,isValid(validator.cartSchema),controllerCart.addToCart)
// user cart
router.get("/" , isAuthenticated ,controllerCart.userCart )
// update cart
router.patch("/",isAuthenticated , isValid(validator.cartSchema) ,controllerCart.updateCart )
// remove product from cart
router.patch("/:productId" , isAuthenticated , isValid(validator.removeProductSchema) , controllerCart.removeProduct)
// clear from cart
router.put("/clear" , isAuthenticated , controllerCart.clearCart)
export default router