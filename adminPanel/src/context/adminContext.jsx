import {createContext,useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
export const AdminContext=createContext();
const AdminContextProvider=(props)=>{
    const [aToken,setAToken]=useState(localStorage.getItem("aToken")?localStorage.getItem("aToken"):"");
    const [doctors,setDoctors]=useState([]);
    const [appointments,setAppointments]=useState([]);
    const [dashData,setDashData]=useState(false);
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const getAllDoctors=async ()=>{
        try{
            const {data}=await axios.get("http://localhost:4000/api/admin/all-doctors",{headers:{aToken}});
            console.log("all doctors in the data: ");
            console.log(data);
            if(data.success){
                setDoctors(data.allDoctors);
            }else{
                toast.error(data.message);
            }
        }catch(err){
            toast.error(err.message);
        }
    }
    const changeAvailability=async (docId)=>{
        try{
            const {data}=await axios.post("http://localhost:4000/api/admin/change-availability",{docId},{headers:{aToken}});
            console.log("changeAvailabilty@@@@@@@@@@@@@@@@@@@");
            console.log(data);
            if(data.success){
                toast.success(data.message);
                getAllDoctors();
            }else{
                toast.error(data.message);
            }
        }catch(err){
            toast.error(err.message);
        }
    }
    const getAllAppointment=async ()=>{
        try{
            const {data}=await axios.get("http://localhost:4000/api/admin/appointments",{headers:{aToken}});
            if(data.success){
                setAppointments(data.allAppointments);
                console.log("All appointments: ");
                console.log(data);
            }else{
                toast.error(data.message);
            }
        }catch(err){
            toast.error(err.message);
        }
    }
    const adminCancelAppointment=async (appointmentId)=>{
        try{
            const {data}=await axios.post("http://localhost:4000/api/admin/cancel-appointment",{appointmentId},{headers:{aToken}});
            if(data.success){
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }

        }catch(err){
            toast.error(err.message)
        }
    }
    const getDashData=async ()=>{
        try{
            const {data}=await axios.get("http://localhost:4000/api/admin/dashboard",{headers:{aToken}});
            if(data.success){
                setDashData(data.dashData);
                console.log(data.dashData);
            }else{
                toast.error(data.message);
            }
        }catch(err){
            toast.error(err.message);
        }
    }
const value={
aToken,setAToken,backendUrl,doctors,getAllDoctors,changeAvailability,appointments,setAppointments,getAllAppointment,adminCancelAppointment,getDashData,dashData
}
return (
    <AdminContext.Provider value={value}>
        {props.children}
    </AdminContext.Provider>
)
}
export default AdminContextProvider;