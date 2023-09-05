import mongoose, { Schema, Types, model } from "mongoose";

const reviewSchema= new Schema({
    user:{type:Types.ObjectId , ref:"User" , required:true},
    content:{type:String , required:true},
    rate:Number
},
{
    timestamps:true
})
export const reviewModel=mongoose.models.Review || model("Review" , reviewSchema)