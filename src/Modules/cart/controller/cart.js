import { cartModel } from "../../../../DB/models/cart.model.js";
import { productModel } from "../../../../DB/models/product.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

// add cart

export const addToCart=asyncHandler(async(req,res,next)=>{

    const {productId , quantity}=req.body

    // check peoduct
    const product=await productModel.findById(productId)
    if(!product) return next(new Error("product not found",{cause:404}))



    // cheak stock

    // if(quantity > product.availableItems)
    // return next(new Error(`sorry, only ${product.availableItems} items left on thr stock!`))


if(!product.inStock(quantity))
// if(!product.inStock(quantity))
{
        return next(new Error(`sorry, only ${product.availableItems} items left on thr stock!`))

}





    // add to Cart

    // const cart =await cartModel.findOne({user:req.user._id});
    // cart.products.push({productId , quantity})
    // await cart.save();

    //check the product existence in the cart

    const isProductInCart=await cartModel.findOne({user:req.user._id, "products.productId":productId})

    if(isProductInCart)
    {
        isProductInCart.products.forEach((productObj) => {
            if(productObj.productId.toString()===productId.toString() && productObj.quantity + quantity < product.availableItems)
            {
                productObj.quantity = productObj.quantity + quantity
            }
            
        });
        await isProductInCart.save()
        return res.json({success:true , result:isProductInCart , mmessage:"product added successfully"})

    }
    else
    {
        console.log({user:req.user._id});

            const cart=await cartModel.findOneAndUpdate({user:req.user._id},{$push:{products:{productId , quantity}}},{new:true})
            return res.json({success:true , result:cart , mmessage:"product added successfully"})

    }


    // anthor mathod to add cart

    // const cart=await cartModel.findOneAndUpdate({user:req.user._id},{$push:{products:{productId , quantity}}},{new:true})
    // return res.json({success:true , result:cart , mmessage:"product added successfully"})

})

// user cart

export const userCart=asyncHandler(async(req,res,next)=>{
    const carts=await cartModel.find({user:req.user._id}).populate({
        path:"products.productId",
        select:"name defaultImage.url price discount"

    })
    return res.json({success:true , result:carts})

})

// update cart

export const updateCart=asyncHandler(async(req,res,next)=>{

    const {productId , quantity}=req.body

    // check peoduct
    const product=await productModel.findById(productId)
    if(!product) return next(new Error("product not found",{cause:404}))

    // cheak stock
    if(quantity > product.availableItems)
    return next(new Error(`sorry, only ${product.availableItems} items left on thr stock!`))

    //update cart

    const cart=await cartModel.findOneAndUpdate({user:req.user._id,"products.productId":productId},{$set:{"products.$.quantity":quantity}},{new:true})

    return res.json({success:true , result:cart , message:"product update successfully"})

 

})

// remove product from cart

export const removeProduct=asyncHandler(async(req,res,next)=>{

    //remove product

    const cart=await cartModel.findOneAndUpdate({user:req.user._id},{$pull:{products:{productId:req.params.productId}}},{new:true})

    return res.json({success:true , results:cart , message:" product remove successfully !"})

})

export const clearCart=asyncHandler(async(req,res,next)=>{
    const cart=await cartModel.findOneAndUpdate({user:req.user._id},{products:[]},{new:true})

    return res.json({success:true , results:cart , message:"cart cleared successfully !"})

})