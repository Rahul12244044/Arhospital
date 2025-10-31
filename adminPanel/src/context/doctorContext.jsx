import {createContext,useState} from "react";
export const DoctorContext=createContext();
import axios from "axios";
import {toast} from "react-toastify";
const DoctorContextProvider=(props)=>{
    const [dToken,setdToken]=useState(localStorage.getItem("dToken")?localStorage.getItem("dToken"):"");
    const [appointments,setAppointments]=useState([]);
    const [dashData,setDashData]=useState(false);
    const [profileData,setProfileData]=useState(false);
    const getAppointments=async ()=>{
        try{
            const {data}=await axios.get("http://localhost:4000/api/doctor/doctor-appointments",{headers:{dToken}});
            if(data.success){
                setAppointments(data.allAppointments);
                console.log(data.allAppointments);
            }else{
                toast.error(data.message);
            }
        }catch(err){
            toast.error(err.message);
        }
    }
    const completeAppointment=async(appointmentId)=>{
        try{
            const {data}=await axios.post("http://localhost:4000/api/doctor/complete-appointment",{appointmentId},{headers:{dToken}});
            if(data.success){
                toast.success(data.message);
                getAppointments();
            }else{
                toast.error(data.message);
            }
        }catch(err){
            toast.error(err.message);
        }
    }
    const cancelAppointment=async(appointmentId)=>{
        try{
            const {data}=await axios.post("http://localhost:4000/api/doctor/cancel-appointment",{appointmentId},{headers:{dToken}});
            if(data.success){
                toast.success(data.message);
                getAppointments();
            }else{
                toast.error(data.message);
            }
        }catch(err){
            toast.error(err.message);
        }
    }
    const doctorDashboard=async ()=>{
        try{
            const {data}=await axios.get("http://localhost:4000/api/doctor/dashboard-doctor",{headers:{dToken}});
            if(data.success){
                setDashData(data.dashboardData);
                console.log(data.dashboardData);
            }else{
                toast.error(data.message);
            }
        }catch(err){
            toast.error(err.message);
        }
    }
    const doctorProfile=async ()=>{
        try{
            const {data}=await axios.get("http://localhost:4000/api/doctor/profile",{headers:{dToken}});
            if(data.success){
                setProfileData(data.doctorData);
                console.log(data.doctorData);
            }else{
                toast.error(data.message);
            }
        }catch(err){
            toast.error(err.message);
        }
    }
const value={
    dToken,setdToken,appointments,setAppointments,getAppointments,completeAppointment,cancelAppointment,doctorDashboard,dashData,setDashData,profileData,setProfileData,doctorProfile
}
return (
    <DoctorContext.Provider value={value}>
        {props.children}
    </DoctorContext.Provider>
)
}
export default DoctorContextProvider;