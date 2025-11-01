import RepositoryDoctor from "../respository/repository.doctor.js";
import {doctorModel} from "../models/doctorModel.js"
import {appointmentModel} from "../models/appointment.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export default class DoctorController{
    changeAvailability=async (req,res,next)=>{
        try{
            const {docId}=req.body;
            console.log("docId: ");
            console.log(docId);
            await RepositoryDoctor.changeAvailabiltyDocotr(docId);
            res.json({success:true,message:"Availabilty Changed"});
        }catch(err){
            console.log(err);
            next(err);
        }
    }
    getDoctorsData=async (req,res,next)=>{
        try{
            const allDoctors=await RepositoryDoctor.allDoctor();
            res.json({success:true,doctors:allDoctors});
        }catch(err){
            next(err);
        }
    }
    loginDoctor=async (req,res,next)=>{
        try{
            const {email,password}=req.body;
            const doctorFound=await doctorModel.findOne({email});
            if(!doctorFound){
                return res.json({success:false,message:"Invalid Credentials."});
            }
            const isMatch=bcrypt.compare(password,doctorFound.password);
            if(isMatch){
                const token=jwt.sign({id:doctorFound._id},process.env.JWT_SECRET);
                res.json({success:true,token});
            }else{
                res.json({success:false,message:"Invalid Credentials."});
            }
        }catch(err){
            next(err);
        }
    }
    appointmentsDoctor=async (req,res,next)=>{
        try{
            const {id}=req.doctor;
            const allAppointments=await appointmentModel.find({docId:id});
            res.json({success:true,allAppointments});
        }catch(err){
            next(err);
        }
    }
    appointmentComplete=async (req,res,next)=>{
    try{
        const {id}=req.doctor;
        const {appointmentId}=req.body;
        const appointmentData=await appointmentModel.findById(appointmentId);
        if(appointmentData && appointmentData.docId==id){
            // Mark as completed and also ensure payment is marked as paid
            await appointmentModel.findByIdAndUpdate(appointmentId,{
                isCompleted: true,
                paid: true, // Ensure payment is marked as completed
                payment: true // Keep the existing field for backward compatibility
            });
            res.json({success:true,message:"Appointment Completed."});
        }else{
            res.json({success:false,message:"Mark Failed."});
        }
    }catch(err){
        next(err);
    }
}
    appointmentCancel=async (req,res,next)=>{
        try{
            const {id}=req.doctor;
            const {appointmentId}=req.body;
            const appointmentData=await appointmentModel.findById(appointmentId);
            if(appointmentData && appointmentData.docId==id){
                await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});
                res.json({success:true,message:"Appointment Cancelled."});
            }else{
                res.json({success:false,message:"Cancellation Failed."});
            }
        }catch(err){
            next(err);
        }
    }
    doctorDashboard=async (req,res,next)=>{
        try{
            const {id}=req.doctor;
            const appointmentData=await appointmentModel.find({docId:id});
            let earnings=0;
            appointmentData.map((item,index)=>{
                if(item.isCompleted || item.payment){
                    earnings=earnings+item.amount;
                }
            });
            let patients=[];
            appointmentData.map((item,index)=>{
                if(!patients.includes(item.userId)){
                    patients.push(item.userId);
                }
            });
            const dashboardData={
                earnings,
                appointments:appointmentData.length,
                patients:patients.length,
                latestAppointment:appointmentData.reverse().slice(0,5)
            }
            res.json({success:true,dashboardData});
        }catch(err){
            next(err);
        }
    }
    doctorProfile=async (req,res,next)=>{
        try{
            const {id}=req.doctor;
            const doctorData=await doctorModel.findById(id);
            res.json({success:true,doctorData});
        }catch(err){
            next(err);
        }
    }
    updateDoctorProfile=async (req,res,next)=>{
        try{
            const {fees,address,available}=req.body.updateData
            console.log("req.body: ");
            console.log(req.body);
            console.log("fees: ");
            console.log(fees);
            console.log("address: ");
            console.log(address);
            console.log("available: ");
            console.log(available);
            const {id}=req.doctor;
            await doctorModel.findByIdAndUpdate(id,{fees,address,available});
            res.json({success:true,message:"Profile Updated."});

        }catch(err){
            next(err);
        }
    }
}