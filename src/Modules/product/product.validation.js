import joi from "joi";
import { isValidObjectId } from "../../Middleware/validation.middleware.js"

// create schema

export const createProductSchema=joi.object({
name:joi.string().required().min(2).max(20),
description:joi.string(),
availableItems:joi.number().min(1).required(),
price:joi.number().min(1).required(),
discount:joi.number().min(1).max(100),
category:joi.string().custom(isValidObjectId),
subcategory:joi.string().custom(isValidObjectId),
brand:joi.string().custom(isValidObjectId)
}).required()

// delete schema

export const deleteProductSchema=joi.object({
productId:joi.string().custom(isValidObjectId)
}).required()

// read single product schema

export const singleProduct=joi.object({
productId:joi.string().custom(isValidObjectId)
}).required()



