import authRouter from './Modules/auth/auth.router.js'
import categoryRouter from './Modules/category/category.router.js'
import subCategoryRouter from './Modules/subcategory/subcategory.router.js'
import brandRouter from './Modules/brand/brand.router.js'
import couponRouter from './Modules/coupon/coupon.router.js'
import cartRouter from './Modules/cart/cart.router.js'
import productRouter from './Modules/product/product.router.js'
import orderRouter from './Modules/order/order.router.js'
import reviewRouter from './Modules/review/review.router.js'
import morgan from 'morgan'
import cors from "cors"
import { globalErrorHandling } from './utils/asyncHandler.js'
export const appRouter =(app , express) =>{
  // morgan
  //  if(process.env.NODE_ENV){
  //   app.use(morgan("dev"))
  //  }

   // CORS

  //  const whitelist =["http://127.0.0.1:5500"]
  //  app.use((req,res,next)=>{

  //   // activate account api
  
  //   if(req.originalUrl.includes("/auth/confirmEmail"))
  //   {
  //     res.setHeader("Access-Control-Allow-Origin", "*");
  //     res.setHeader("Acccess-Control-Allow-Methods", "GET");
  //     return next();

  //   }
  //   if(!whitelist.includes(req.header("origin")))
  //   {
  //     return next(new Error("Blocked By CORS!"));
     
  //   }
  //   res.setHeader("Access-Control-Allow-Origin", "*");
  //   res.setHeader("Access-Control-Allow-Headers", "*");
  //   res.setHeader("Acccess-Control-Allow-Methods", "*");
  //   res.setHeader("Acccess-Control-Allow-Private-Network", true);
  //   return next();

  //  })

  
  app.use(cors())   // allow all origins
 

    //global middleware
    app.use((req,res,next)=>{
      // req.originalUrl
      if(req.originalUrl === '/order/webhoock')
      {
        return next
      }
      express.json()(req,res,next)
    })
    // app.use(express.json())

    //Routes

    
    //auth
    app.use("/auth",authRouter)

    // category
    app.use("/category" , categoryRouter)

    // subcategory
    app.use("/subcategory" , subCategoryRouter)

    // brand
    app.use("/brand" , brandRouter)

    // product
    app.use("/product" , productRouter)

      // coupon
      app.use("/coupon" , couponRouter)

      // cart
      app.use("/cart" , cartRouter)
      // order
      app.use("/order" ,orderRouter )
      // review
      app.use("/review" ,reviewRouter )


    app.all("*" ,(req , res , next ) =>{
        return next(new Error ('Page not found !' , {cause : 404}))
        // res.json({message:"Page Not Found !"})
    })

    app.use(globalErrorHandling)

 
}