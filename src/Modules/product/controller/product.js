import { nanoid } from "nanoid";
import { productModel } from "../../../../DB/models/product.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import cloudinary from "../../../utils/cloud.js";
import { categoryModel } from "../../../../DB/models/category.model.js";
import { brandModel } from "../../../../DB/models/brand.model.js";
import { subcategoryModel } from "../../../../DB/models/subcategory.model.js";

export const createBrand=asyncHandler(async(req,res,next)=>{

    // const {name , description , price , discount , availableItems , category , subcategory , brand}=req.body
    //check category
    const category = await categoryModel.findById(req.body.category)
    if(!category)return next(new Error("category not found"));

    //check subcategory

    const subcategory = await subcategoryModel.findById(req.body.subcategory)
    if(!subcategory)return next(new Error("subcategory not found"));
    //check brand

    const brand = await brandModel.findById(req.body.brand)
    if(!brand)return next(new Error("brand not found"));



    // check file
    if(!req.files) return next(new Error("product images are required" , {cause:400}))

    // create unique folder name
    const cloudFolder=nanoid()
    let images=[];

    // upload file
    for(const file of req.files.subImages)
    {
        const {public_id , secure_url}=await cloudinary.uploader.upload(
            file.path,
            {
                folder:`${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}`
            }
        )
        images.push({id:public_id , url:secure_url})
    }
    // upload default image

const {public_id , secure_url}=await cloudinary.uploader.upload(
            req.files.defaultImage[0].path,
            {
                folder:`${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}`
            }
        )

    // create product   

            const product= await productModel.create({
                ...req.body,
                cloudFolder,
                createdBy:req.user._id,
                defaultImage:{id:public_id , url:secure_url},
                images,
            })

            return res.status(201).json({success:"true" , results:product})



}
)

export const deleteBrand=asyncHandler(async(req,res,next)=>{

    // check product
    const product=await productModel.findById(req.params.productId)
    if(!product) return next(new Error("Product not found"))

    // check owner

    if(req.user._id.toString() != product.createdBy.toString())
    return next(new Error("You aren't authorized !"))

    const imagesArr = product.images

    const ids=imagesArr.map((imageObj) => imageObj.id);
    // add id of default image
    ids.push(product.defaultImage.id)
    const result=await cloudinary.api.delete_resources(ids)
    // delete folder
    await cloudinary.api.delete_folder(`${process.env.FOLDER_CLOUD_NAME}/products/${product.cloudFolder}`)

    // delete product

    await productModel.findByIdAndDelete(req.params.productId)

    return res.json({success:true , message:"Product delete successfully"})
})

export const allProducts=asyncHandler(async(req,res,next)=>{


    if(req.params.categoryId)
    {
        const category =await categoryModel.findById(req.params.categoryId);
        if(!category) return next(new Error("Category not found",{cause:404}))
        const products =await productModel.find({category:req.params.categoryId})
        return res.json({success:true ,results:products})
    }





    // const { Keyword } = req.query;
    
    // const products=await productModel.find({$or:[{name:{$regex:Keyword,$options: "i"}},{description:{$regex:Keyword,$options: "i"}}]});
    // return res.json({success:true , results:products})


//  const { name , price , x } = req.query;

/////////// filter/////////////
    
    // const products=await productModel.find({...req.query});
    // return res.json({success:true , results:products})

    ///////// pagination///////////

//     let {page} = req.query
//     page= !page || page < 1 || isNaN(page) ? 1 : page
//     const limit = 2;
//     const skip = (page-1) * limit

//  const products=await productModel.find().skip(skip).limit(limit);
//     return res.json({success:true , results:products})



///////////// sort /////////////

//     const {sort} = req.query
// const products=await productModel.find().sort(sort)
//     return res.json({success:true , results:products})



/////////// selection ///////////
// const {fields} = req.query
// const modelKeys = Object.Keys(productModel.schema.pahts)

// const queryKeys = fields.split(" ")

// const matchKeys=queryKeys.filter((key) => modelKeys.includes(key))

// const products=await productModel.find().select(fields)
// return res.json({success:true , results:products})


const products=await productModel.find({...req.query}).paginate(req.query.page).customSelect(req.query.fields).sort(req.query.sort)
return res.json({success:true , results:products})


})


export const singleProduct = asyncHandler(async(req,res,next)=>{
    const product =await productModel.findById(req.params.productId)
    return res.json({success:true , results:product})
})



