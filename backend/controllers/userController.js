import RepositoryUser from "../respository/repository.user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {mysqlPool} from "../config/mongodb.js";
import {doctorModel} from "../models/doctorModel.js";
import {userModel} from "../models/userModel.js";
import {appointmentModel} from "../models/appointment.model.js";
export default class UserController{
    registerUser=async (req,res,next)=>{
        try{
            console.log("req.body: ");
            console.log(req.body);
            const {name,email,password}=req.body;
            if(!name || !email || !password){
                return res.json({success:false,message:"Missing Details."});
            }
            if(password.length<8){
                return res.json({success:false,mesage:"enter strong password."});
            }
            const isUserFound=await RepositoryUser.findUserEmail(email);
            console.log("isUserFound: ");
            console.log(isUserFound);
            if(isUserFound){
                return res.json({success:false,message:"Email is already registered."});
            }
            const salt=await bcrypt.genSalt(11);
            const hashPassword=await bcrypt.hash(password,salt);
            const user={name,email,password:hashPassword};
            
            const userDoc=await RepositoryUser.registerUser(user);
            console.log("userDoc: ");
            console.log(userDoc);
            const token=jwt.sign({id:userDoc._id,email:userDoc.email},process.env.JWT_SECRET)
            res.json({success:true,token});
        }catch(err){
            next(err);
        }
    }
    loginUser=async (req,res,next)=>{
        try{
            const {email,password}=req.body;
            const isUserFound=await RepositoryUser.findUserEmail(email);
            if(!isUserFound){
                return res.json({success:false,message:"User does not exist."});
            }
            const isMatch=await bcrypt.compare(password,isUserFound.password);
            if(isMatch){
                const token=jwt.sign({id:isUserFound._id,email},process.env.JWT_SECRET);
                return res.json({success:true,token});
            }else{
                return res.json({success:false,message:"Invalid Credentials."});
            }
        }catch(err){
            next(err);
        }
    }
    getProfile=async (req,res,next)=>{
        try{
            const {id}=req.user;
            console.log("getProfile: ");
            console.log(id);
            const userProfile=await RepositoryUser.getUserProfile(id);
            res.json({success:true,userProfile});
        }catch(err){
            console.log(err);
            next(err);
        }
    }
    updateProfile=async (req,res,next)=>{
        try{
            const {name,phone,dob,gender,address}=req.body;
            const {id}=req.user;
            const imageFile=req.file;
            if(!name || !dob || !phone || !gender){
                return res.json({sucess:false,message:"Missing Details."});
            }
            const userProfileDoc=await RepositoryUser.updateUserProfile(id,{name,phone,dob,gender,address:JSON.parse(address)},imageFile);
            if(userProfileDoc){
                return res.json({success:true,message:"Profile Updated."});
            }else{
                return res.json({success:false,message:"Profile Update Failed."});
            }
        }catch(err){
            next(err);
        }
    }
    bookAppointment=async (req,res,next)=>{
        try{
            const {id}=req.user;
            const {docId,slotDate,slotTime}=req.body;
            const doctData=await doctorModel.findById(docId).select("-password");
            if(!doctData.available){
                return res.json({success:false,message:"Doctor not available."})
            }
            let slots_booked=doctData.slots_booked;
            if(slots_booked[slotDate]){
                if(slots_booked[slotDate].includes(slotTime)){
                    return res.json({success:false,message:"Slot not available."});
                }else{
                    slots_booked[slotDate].push(slotTime);
                }
            }else{
                slots_booked[slotDate]=[];
                slots_booked[slotDate].push(slotTime);
            }
            const userData=await userModel.findById(id).select("-password");
            console.log("userData: ");
            console.log(userData);
            delete doctData.slots_booked;
            const appointmentData={
                userId:id,
                docId,
                userData,
                docData:doctData,
                amount:doctData.fees,
                slotDate,
                slotTime,
                date:Date.now()
            }
            const newAppointment=new appointmentModel(appointmentData);
            await newAppointment.save();
            await doctorModel.findByIdAndUpdate(docId,{slots_booked});
            res.json({success:true,message:"Appointment Booked."});
            

            
        }catch(err){
            next(err);
        }
    }
    listAppointments=async (req,res,next)=>{
        try{
            const {id}=req.user;
            const allAppointments=await RepositoryUser.userAppointments(id);
            console.log("allAppointments: ");
            console.log(allAppointments);
            res.json({success:true,allAppointments});
        }catch(err){
            next(err);
        }
    }
    cancelAppointment=async (req,res,next)=>{
        try{
            const {id}=req.user;
            const {appointmentId}=req.body;
            const appointmentData=await appointmentModel.findById(appointmentId);
            console.log("appointmentData: ");
            console.log(appointmentData);
            if(appointmentData.userId!=id){
                return res.json({success:false,message:"Unauthrized actions."});
            }
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});
            const {docId,slotDate,slotTime}=appointmentData;
            const docData=await doctorModel.findById(docId);
            let slots_booked=docData.slots_booked;
            slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!=slotTime);
            await doctorModel.findByIdAndUpdate(docId,{slots_booked});
            res.json({success:true,message:"Appointment Cancelled."});

        }catch(err){
            next(err);
        }
    }
  paymentAppointment = async (req, res, next) => {
    try {
        const { appointmentId, gpayId, amount, paymentMethod } = req.body;
        
        // Validate required fields
        if (!appointmentId || !gpayId) {
            return res.json({
                success: false,
                message: 'Appointment ID and GPay ID are required'
            });
        }

        // Find the appointment
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check if appointment is already paid
        if (appointment.paid || appointment.payment) {
            return res.json({
                success: false,
                message: 'Payment already completed for this appointment'
            });
        }

        // Check if appointment is cancelled
        if (appointment.cancelled) {
            return res.json({
                success: false,
                message: 'Cannot process payment for cancelled appointment'
            });
        }

        // Update appointment with payment details - UPDATE BOTH FIELDS
        const updatedAppointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            { 
                paid: true,           // New field
                payment: true,        // Your existing field
                paymentMethod: paymentMethod || 'gpay',
                paymentId: `TXN${Date.now()}`,
                paymentDate: new Date(),
                gpayId: gpayId,
                amount: amount || 500,
                status: 'paid'
            },
            { new: true }
        ).populate('docData');

        console.log('Payment successful - Updated appointment:', {
            id: updatedAppointment._id,
            paid: updatedAppointment.paid,
            payment: updatedAppointment.payment,
            status: updatedAppointment.status
        });

        res.json({
            success: true,
            message: 'Payment processed successfully',
            appointment: updatedAppointment
        });
        
    } catch (error) {
        console.error('Payment error:', error);
        next(error);
    }
}

// Use the same function for both endpoints to avoid duplication
proccesPayment = async (req, res, next) => {
    await this.paymentAppointment(req, res, next);
}

appointmentById = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;
        
        const appointment = await appointmentModel.findById(appointmentId)
            .populate('docData')
            .populate('userId', 'name email');
            
        if (!appointment) {
            return res.json({
                success: false,
                message: 'Appointment not found'
            });
        }

        console.log('Fetched appointment:', {
            id: appointment._id,
            paid: appointment.paid,
            payment: appointment.payment,
            status: appointment.status
        });

        res.json({
            success: true,
            appointment: appointment
        });
        
    } catch (error) {
        console.error('Error fetching appointment:', error);
        next(error);
    }
}
}