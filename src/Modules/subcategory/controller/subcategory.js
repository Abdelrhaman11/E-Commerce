import slugify from "slugify";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import cloudinary from "../../../utils/cloud.js"
import { categoryModel } from "../../../../DB/models/category.model.js";
import { subcategoryModel } from "../../../../DB/models/subcategory.model.js";

//create subcategory
export const createSubCategory = asyncHandler(async(req,res,next) =>{
    //categoryId ?? params
    const { categoryId } =req.params

       // check file
       if(!req.file) return next(new Error("Image is required !" ,{ cause : 400}))

      //check category
      const category = await categoryModel.findById(categoryId)
      if (!category) return next(new Error("Category not found" , { cause:404 }))

    // upload file
    const {public_id,secure_url} = await cloudinary.uploader.upload(
        req.file.path,
        {folder:`${process.env.FOLDER_CLOUD_NAME}/subcategory` }
    )
    console.log(secure_url)
    console.log(public_id)
    //save in database
    const subcategory = await subcategoryModel.create({
        name:req.body.name,
        slug:slugify(req.body.name),
        createdBy:req.user._id,
        image:{id : public_id , url:secure_url},
        categoryId
    })

    return res.json({success: true , results:subcategory})
})

//update subcategory
export const updateSubCategory = asyncHandler(async(req,res,next) =>{
    //check category
  const category= await categoryModel.findById(req.params.categoryId)
    if(!category) return next(new Error("Category not found !" , {cause:404}))
 //check subcategory
const subcategory =await subcategoryModel.findById(req.params.subcategoryId)

  if(!subcategory)
    return next(new Error("Subcategory not found !",{cause : 404}))

// check owner
if(req.user._id.toString() !== subcategory.createdBy.toString())
  return next(new Error("You aren't authorized !"))

subcategory.name = req.body.name ? req.body.name : subcategory.name;
subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug;

//file ?
if(req.file) {
    const {secure_url} =await cloudinary.uploader.upload(req.file.path ,{
        public_id :subcategory.image.id,
    })
    subcategory.image.url = secure_url
}

await subcategory.save()

return res.json({
    success: true,
    message:"updated successfully !",
    results:subcategory,
})
})

//delete subCategory
export const deleteSubCategory =asyncHandler(async (req,res,next)=>{
     //check category

     const category= await categoryModel.findById(req.params.categoryId)
     if(!category) return next(new Error("Category not found !" , {cause:404}))

     //check subcategory and delete

const subcategory = await subcategoryModel.findByIdAndDelete(req.params.subcategoryId)
 if(!subcategory)
 return next(new Error("Subcategory not found !",{cause : 404}))
 
 // check owner
if(req.user._id.toString() !== subcategory.createdBy.toString())
return next(new Error("You aren't authorized !"))


const results = await cloudinary.uploader.destroy(subcategory.image.id);

// if(results.result=="ok")
// {
//     await subcategoryModel.findByIdAndDelete(req.params.subcategoryId)

// }

 return res.json({
     success: true,
     message:"deleted successfully !"
 })
})

// get all subcategories
export const allsubcategories = asyncHandler(async(req,res,next)=>{
    const subcategories = await subcategoryModel.find().populate([{
        path:"categoryId",
        select:"name"
    },
    {
        path:"createdBy"
    }
])

    return res.json({ success : true , results:subcategories})
})