import mongoose, { Schema, Types, model } from "mongoose";

//Schema
const cartSchema=new Schema({

user:{type:Types.ObjectId,ref:"User" , required:true , unique:true}, // unique علشان مينفعش اليوزر يبقي ليه اكتر من cart
products:[
    {
        //_id
        _id:false,
        productId:{type:Types.ObjectId,ref:"Product" , unique:true},
        quantity:{type:Number , default:1},
    }
]


},{
timestamps:true
})

//model
export const cartModel=mongoose.models.Cart || model("Cart",cartSchema)