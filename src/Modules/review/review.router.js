import { Router } from "express";
import { isAuthenticated } from "../../Middleware/authuntication.middleware.js";
import {addReview} from "./controller/review.js"
import { rateSchema } from "./review.validation.js";
import { isValid } from "../../Middleware/validation.middleware.js";


const router =Router();

router.post("/" , isAuthenticated, isValid(rateSchema), addReview)

export default router