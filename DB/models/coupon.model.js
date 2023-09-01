import mongoose, { Schema, Types, model } from "mongoose";

// Schema

const couponSchema= new Schema({
    name:{type:String , required:true},
    discount:{type:Number , min:1 , max:100 , required:true},
    expiredAt:Number,
    createdBy:{type:Types.ObjectId , ref:"User" , required:true}
},{timestamps:true})

// model

export const couponModel=mongoose.models.Coupon || model("Coupon" ,couponSchema )

