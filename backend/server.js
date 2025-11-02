import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import dbConnected from "./config/mongodb.js";
import cloudinaryConnect from "./config/cloudinary.js";
import adminRouter from "./routes/admin.routes.js";
import routerDoctor from "./routes/doctor.routes.js";
import routerUser from "./routes/user.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import {mysqlPool} from "./config/mongodb.js";
// config app
const app=express();
// middlewares
app.use(express.json()); // it is body parser
app.use(express.urlencoded({extended:true}));
app.use(cors()); // it allow frontend to connect with backend
const PORT=process.env.PORT || 4000;
app.use("/api/admin",adminRouter);
app.use("/api/doctor",routerDoctor);
app.use("/api/user",routerUser);
app.use("/api/feedback",feedbackRouter);
app.use((err,req,res,next)=>{
    console.log("Error in the err:@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ");
    console.log(err);
    
        return res.json({success:false,message:err.message});
   
})
app.listen(PORT,()=>{
    console.log(`Server is connected to PORT ${PORT}`);
    dbConnected();
    (async () => {
  try {
    const [rows] = await mysqlPool.query("SELECT 1 + 1 AS result");
    console.log("✅ MySQL connected, test result:", rows[0].result);
  } catch (err) {
    console.error("❌ MySQL connection failed:", err);
  }
})();
 
    cloudinaryConnect();
})