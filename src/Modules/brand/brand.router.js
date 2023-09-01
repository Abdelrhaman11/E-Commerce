import { Router } from "express";
import { isAuthenticated } from "../../Middleware/authuntication.middleware.js";
import { isAuthorized } from "../../Middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import * as validator from "./brand.validation.js";
import * as controllerBrand from "./controller/brand.js"
import { isValid } from "../../Middleware/validation.middleware.js";

const router=Router()

//CRuD
//create brand
router.post("/" ,
isAuthenticated,
isAuthorized("admin"),
fileUpload(filterObject.image).single("brand"),
isValid(validator.createBrandSchema),
controllerBrand.createBrand)

// update brand
router.patch("/:brandId" , 
isAuthenticated , 
isAuthorized("admin"),
fileUpload(filterObject.image).single("brand"),
isValid(validator.updateBrandSchema),
controllerBrand.updateBrand
)
// delete brand
router.delete("/:brandId" , 
isAuthenticated , 
isAuthorized("admin"),
isValid(validator.deleteBrandSchema),
controllerBrand.deleteBrand
)



//Get categories
router.get("/",controllerBrand.allBrands)







export default router
