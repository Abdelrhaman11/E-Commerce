import { userModel } from "../../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import bcryptjs from "bcryptjs"
import crypto from 'crypto'
import { sendEmail } from "../../../utils/sendEmails.js";
import  jwt  from "jsonwebtoken";
import randomstring from 'randomstring';
import { tokenModel } from "../../../../DB/models/token.model.js";
import { cartModel } from "../../../../DB/models/cart.model.js";
export const register=asyncHandler(async(req,res,next)=>{
     //data from request
     const {userName , email , password} = req.body;
     //check userModel existence
     const isUser=await userModel.findOne({email})
     if(isUser) return next(new Error('Email already registerd !' ,{cause:409}))
     //hash Passord
     const hashPassword = bcryptjs.hashSync(password , Number(process.env.SALT_ROUND))
     // generate activationCode
     const activationCode = crypto.randomBytes(64).toString('hex')
     
     //create user
     const user = await userModel.create({userName , email ,password:hashPassword,activationCode})
     //create confirmationLink
     const link= `${req.protocol}://${req.headers.host}/auth/confirmEmail/${activationCode}`
 
     const html=`
     <button class="border rounded-pill  " ><a href="${link}">Activate Email</a></button>
     `
 
     //send Email
     const isSent= await sendEmail({to:email,subject:"Activate Account" , html})
     //send response
     return isSent ? res.json({success: true , message:'please review your email'} ) : next(new Error('Somthing went wrong'))

})

//activate Account
export const activateAccount = asyncHandler(async (req , res ,next) =>{
    //find user , delete the activationCode , update isConfirmed
    const user = await userModel.findOneAndUpdate({activationCode: req.params.activationCode} ,{
    isConfirmed:true , $unset:{activationCode: 1}
})
//check id the user doesn't exist
if(!user)return next(new Error('User not found !' ,{cause: 404}))

//create a cart

await cartModel.create({user:user._id})




//create a cart
//send response
return res.send("Congratulation, your account is now activated !, try to login Now")
})


//login
export const login=asyncHandler(async(req , res , next) =>{
    //data from request
    const {email , password} = req.body;
    // check user existence
    const user = await userModel.findOne({email})
    if(!user) 
       return next(new Error("Invalid Email !" , {cause:400})) 
    //check isCofirmed
    if(!user.isConfirmed)
       return next(new Error("Email isn't Activated !" , {cause : 400}))
    //check password
    const match= bcryptjs.compareSync(password,user.password);
    if(!match)
       return next(new Error("Invalid Password" , {cause : 400}))
    //generaate token
    const token =jwt.sign({ id:user._id , email:user.email},process.env.TOKEN_KEY ,{
        expiresIn:"2d",
    })
    //save token in token model
    await tokenModel.create({
        token ,
        user:user._id,
        agent:req.headers["user-agent"],
    })
    //change user status to online and save user
    user.status="online";
    await user.save();
    //send response
    return res.json({success:true , results:token})
})

//send forget code
export const sendForgetCode = asyncHandler(async( req , res , next ) =>{
    //check user
    const user = await userModel.findOne({ email :req.body.email})
    if(!user) return next(new Error("Invalid email !"));

    //generate code
    const code = randomstring.generate({
        length :5,
        charset:"numeric"
    })
    //save code in db
    user.forgetCode=code
    await user.save();

    const html=`
     <h1>${code}</h1>`

    //send email
    return await sendEmail({
        to:user.email,
        subject: "Reset Password",
        html:html
    }) ? res.json({success : true , message: "check your email !"}) :next(new Error('somthing went wrong'))
    
})

//reset password
export const resetPassword = asyncHandler(async (req , res , next) =>{
    //check user
    let user = await userModel.findOne({email :req.body.email})
    if(!user) return next(new Error("Invalid Email !"))
    //check code

    if(user.forgetCode !== req.body.forgetCode)
      return next(new Error("Invalid code !"));
    
    user=await userModel.findOneAndUpdate({email :req.body.email} ,{$unset : {forgetCode :1}});

    user.password = bcryptjs.hashSync(req.body.password,Number(process.env.SALT_ROUND));

    await user.save();

    //Invalidate tokens
    const tokens = await tokenModel.find({user: user._id});

    tokens.forEach(async (token) =>{
        token.isValid = false;
        await token.save()
    })
    //send response
    return res.json({ success :true , message:"Try to login !"}) 
})
