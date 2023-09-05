import joi from "joi";


export const rateSchema=joi.object({
    rate:joi.number().integer().min(1).max(10).required()
}).required()