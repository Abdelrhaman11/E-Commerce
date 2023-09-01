import mongoose, { Schema, Types, model } from "mongoose";

const subCategorySchema = new Schema(
    {
    name: {type:String , required:true , min : 5, max:20 },
    slug:{type:String , required:true},
    image:{
        id:{type:String , required:true},
        url:{type:String , required:true}
    },
    brandId:[{type:Types.ObjectId , ref:"Brand"}],
    categoryId:{
        type:Types.ObjectId,
        ref:"Category",
        required: true,
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    }
    },
    {timestamps:true}
)

export const subcategoryModel=mongoose.models.Subcategory || model("Subcategory" , subCategorySchema)
