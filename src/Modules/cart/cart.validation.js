import joi from "joi";
import { isValidObjectId } from "../../Middleware/validation.middleware.js";

// add to cart and update schema
export const cartSchema=joi.object({
    productId:joi.string().custom(isValidObjectId).required(),
    quantity:joi.number().integer().min(1).required()

}).required()

// remove product from cart
export const removeProductSchema=joi.object({
    productId:joi.string().custom(isValidObjectId).required(),

}).required()

