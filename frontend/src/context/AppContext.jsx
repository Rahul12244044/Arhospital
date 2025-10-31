import React,{useState,useEffect} from "react";
import {createContext} from "react";
// import {doctors} from "../assets/allAssets.js";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
export const AppContext=createContext();
export const AppContextProvider=(props)=>{
    const [doctors,setDoctors]=useState([]);
    const [userData,setUserData]=useState(false);
    const [aToken,setAToken]=useState(localStorage.getItem("token")?localStorage.getItem("token"):false);
    
    const getDoctorsData=async ()=>{
        try{
            const {data}=await axios.get("https://arhospital.onrender.com/api/doctor/list");
            if(data.success){
             setDoctors(data.doctors);   
            }else{
                toast.error(data.message);
            }
        }catch(err){
            toast.error(err.message);
        }
    }
    const loadUserData=async ()=>{
        try{
            const {data}=await axios.get("https://arhospital.onrender.com/api/user/get-profile",{headers:{token:aToken}});
            console.log("user profile data: ");
            console.log(data);
            if(data.success){
                setUserData(data.userProfile);
            }else{
                toast.error(data.message);
            }
        }catch(err){
            toast.error(err.message);
        }
    }
    const value={
        doctors,aToken,setAToken,setUserData,userData,loadUserData,getDoctorsData
    }
    useEffect(()=>{
        getDoctorsData();
    },[]);
    useEffect(()=>{
        if(aToken){
            loadUserData();
        }else{
            setUserData(false);
        }
    },[aToken])
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}