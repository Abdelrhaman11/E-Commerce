import { Router } from "express";
import * as validator from "./category.validation.js";
import { isAuthenticated } from "../../Middleware/authuntication.middleware.js";
import { isAuthorized } from "../../Middleware/authorization.middleware.js";
import { fileUpload } from "../../utils/multer.js";
import { filterObject } from "../../utils/multer.js";
import subcategoryRouter from "./../subcategory/subcategory.router.js"
import productRouter from "./../product/product.router.js"
import * as controllerCategory from "./controller/category.js"
import { isValid } from"../../Middleware/validation.middleware.js";
const router = Router()


router.use("/:categoryId/subcategory", subcategoryRouter)
router.use("/:categoryId/product", productRouter)

//CRuD
//create category
router.post("/" ,
isAuthenticated,
isAuthorized("admin"),
fileUpload(filterObject.image).single("category"),
isValid(validator.createCategorySchema),
controllerCategory.createCategory)



// update category
router.patch("/:categoryId" , 
isAuthenticated , 
isAuthorized("admin"),
fileUpload(filterObject.image).single("category"),
isValid(validator.updateCategorySchema),
controllerCategory.updateCategory
)


// delete category
router.delete("/:categoryId" , 
isAuthenticated , 
isAuthorized("admin"),
isValid(validator.deleteCategorySchema),
controllerCategory.deleteCategory
)



//Get categories
router.get("/",controllerCategory.allCatigories)
export default router
