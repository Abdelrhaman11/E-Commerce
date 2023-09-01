import joi from 'joi'
import { isValidObjectId } from "../../Middleware/validation.middleware.js"

//crate brand
export const createBrandSchema = joi.object({
    name:joi.string().min(4).max(20).required(),
    categoryId:joi.string().custom(isValidObjectId).required(),

}).required()


//update brand
export const updateBrandSchema = joi.object({
    name: joi.string(),
    brandId:joi.string().custom(isValidObjectId).required(),
}).required()

//delete brand
export const deleteBrandSchema = joi.object({
    brandId:joi.string().custom(isValidObjectId).required()
}).required()

// //mongoose
// Types.ObjectId.isValid("aegmg")