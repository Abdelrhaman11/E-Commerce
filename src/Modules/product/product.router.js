import { Router } from "express";
import { isAuthenticated } from "../../Middleware/authuntication.middleware.js";
import { isAuthorized } from "../../Middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import { isValid } from "../../Middleware/validation.middleware.js";
import * as validator from "./product.validation.js";
import * as controllerProduct from "./controller/product.js"

const router=Router({mergeParams:true})

//create product

router.post("/" ,
isAuthenticated,
isAuthorized("admin"),
fileUpload(filterObject.image).fields([
    {name:"defaultImage" , maxCount:1},
    {name:"subImages" , maxCount:3}
]),
isValid(validator.createProductSchema),
controllerProduct.createBrand)

// delete product

router.delete("/:productId",
isAuthenticated,
isAuthorized("admin"),
isValid(validator.deleteProductSchema),
controllerProduct.deleteBrand)

// get all product

router.get("/",controllerProduct.allProducts)

//





// single product

router.get("/singleProduct/:productId" , isValid(validator.singleProduct) , controllerProduct.singleProduct)







export default router