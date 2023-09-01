export const asyncHandler =(contrller)=>{
    return(req , res , next)=>{
        contrller(req , res , next).catch((error)=>next(error))
    }
}
