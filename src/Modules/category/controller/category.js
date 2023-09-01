import slugify from "slugify";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import cloudinary from "../../../utils/cloud.js";
import { categoryModel } from "../../../../DB/models/category.model.js";
import { subcategoryModel } from "../../../../DB/models/subcategory.model.js";


//create category
export const createCategory= asyncHandler(async(req,res,next) =>{
   
    //file
    if(!req.file) return next(new Error("category image is required !"))
    const {public_id,secure_url} = await cloudinary.uploader.upload(
        req.file.path,
        {folder:`${process.env.FOLDER_CLOUD_NAME}/category` }
    )
    console.log(secure_url)
    console.log(public_id)
        //save category in db
    const category = await categoryModel.create({
            name: req.body.name ,
            createdBy:req.user._id,
            image:{id:public_id , url:secure_url},
            slug:slugify(req.body.name)
        })
        console.log({category});
        return res.status(201).json({success : true , results:category})

})                   


// update category
export const updateCategory = asyncHandler(async(req,res,next) =>{
    //check category
    const category = await categoryModel.findById(req.params.categoryId )
    if(!category) return next(new Error("category not found !"));

    // check owner
 if(req.user._id.toString() !== category.createdBy.toString())
 return next(new Error("You aren't authorized !"))

    //name
    category.name = req.body.name ? req.body.name : category.name;

    //slug
    category.slug = req.body.name ? slugify(req.body.name) : category.slug
    // files
    if(req.file){
        const {public_id,secure_url} = await cloudinary.uploader.upload(
            req.file.path,
            {
                public_id: category.image.id,
            }
        )
        // url
        category.image.url = secure_url

    }
    //save category
    await category.save();
    return res.json({success : true , result:category})

})


//delete category
export const deleteCategory = asyncHandler(async(req, res,next) =>{
    //check category
    const category = await categoryModel.findById(req.params.categoryId)
    if(!category) return next(new Error("Invalid category id !"))

    // check owner
 if(req.user._id.toString() !== category.createdBy.toString())
 return next(new Error("You aren't authorized !"))

    //delete image
    const result = await cloudinary.uploader.destroy(category.image.id);

    //delete category
   // await category.remove();
   await categoryModel.findByIdAndDelete(req.params.categoryId)

   //delete subcategory
   await subcategoryModel.deleteMany({categoryId:req.params.categoryId})

    return res.json({success:true , message : "category deleted !" })
})

//Get categories
export const allCatigories=asyncHandler(async(req,res,next) =>{
    const categories = await categoryModel.find().populate({
        path:"subcategory",
        // nested populate
        populate:[{path:"createdBy"}]
    })
    return res.json({ success:true , result:categories })
})