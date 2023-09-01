import { Router } from "express";
import { isAuthenticated } from "../../Middleware/authuntication.middleware.js";
import { isAuthorized } from "../../Middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import { isValid } from "../../Middleware/validation.middleware.js";
import * as validator from "./subcategory.validation.js"
import * as subcategoryController from "./controller/subcategory.js"

const router=Router({mergeParams:true})

//CRUD
//Create
router.post('/' , 
isAuthenticated,
isAuthorized("admin"),
fileUpload(filterObject.image).single("subcategory"),
isValid(validator.createSubCategorySchema),
subcategoryController.createSubCategory
)

//update
router.patch('/:subcategoryId' , 
isAuthenticated,
isAuthorized("admin"),
fileUpload(filterObject.image).single("subcategory"),
isValid(validator.updateSubCategorySchema),
subcategoryController.updateSubCategory
)

// delete
router.delete(
    "/:subcategoryId",
    isAuthenticated,
    isAuthorized("admin"),
    isValid(validator.deleteSubCategorySchema),
    subcategoryController.deleteSubCategory
)

// read
router.get("/" , subcategoryController.allsubcategories)



export default router
