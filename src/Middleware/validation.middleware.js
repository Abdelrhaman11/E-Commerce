import {Types} from "mongoose"
export const isValidObjectId = (value , helper) =>{
  if(Types.ObjectId.isValid(value))
  {
    return true
  }
  else
  {
    return helper.message("Invalid objectid")
  }

//   return Types.ObjectId.isValid(value) 
//   ? true
//   : helper.message("Invalid objectid !")

}

export const isValid = (schema) => {
 return(req,res,next)=>{
  
    const copyReq = {...req.body , ...req.params , ...req.query}
    const validationResult = schema.validate(copyReq , {abortEarly: false})
    if (validationResult.error) {
        return res.json({message:"Validation Error" , validationError:validationResult.error.details})

    
    }

    return next()
}
}