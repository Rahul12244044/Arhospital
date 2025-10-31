import React,{useState,useContext,useEffect} from 'react';
import {AppContext} from "../context/AppContext";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
const Login = () => {
    const [email,setEmail]=useState("");
    const [name,setName]=useState("");
    const [password,setPassword]=useState("");
    const [state,setState]=useState("sign up");
    const {aToken,setAToken}=useContext(AppContext);
    const navigate=useNavigate();
    const onSubmitForm=async (event)=>{
        event.preventDefault();
        try{
        if(state==="sign up"){
            const {data}=await axios.post("https://arhospital.onrender.com/api/user/register",{name,email,password});
            if(data.success){
                localStorage.setItem("token",data.token);
                setAToken(data.token);
                toast.success()
            }else{
                toast.error(data.message);
            }
        }else{
             const {data}=await axios.post("https://arhospital.onrender.com/api/user/login",{email,password});
            if(data.success){
                localStorage.setItem("token",data.token);
                setAToken(data.token);
                toast.success()
            }else{
                toast.error(data.message);
            }
        }
    }catch(err){
        toast.error(err.message);
    }
    }
    useEffect(()=>{
        if(aToken){
            navigate("/");
        }
    },[aToken])
    return (
        <form onSubmit={onSubmitForm} className="min-h-[80vh] flex items-center">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[35px] sm:min-w-96 border border-gray-300 rounded-xl text-sm shadow-lg shadow-xl">
                <p className="text-2xl font-semibold">{state==="sign up"?"Create Account":"Login"}</p>
                <p>Please {state==="sign up"?"sign up":"log in"} to book Appointment</p>
                {
                    state==="sign up"
                    ?<div className="w-full">
                    <p>Full Name</p>
                    <input className="border border-zinc-300 rounded w-full p-2 mt-1" type="text" onChange={(event)=>setName(event.target.value)} value={name} required/>
                    </div>
                    :null
                }
                    
                    <div className="w-full">
                    <p>Email</p>
                    <input  className="border border-zinc-300 rounded w-full p-2 mt-1" type="email" onChange={(event)=>setEmail(event.target.value)} value={email} required/>
                    </div>
                    <div className="w-full">
                    <p>Password</p>
                    <input  className="border border-zinc-300 rounded w-full p-2 mt-1" type="password" onChange={(event)=>setPassword(event.target.value)} value={password} required/>
                    </div>
                    <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded-md text-base cursor-pointer">{state==='sign up'?"Create Account":"Login"}</button>
                    {
                        state==="sign up"
                        ?<p>Already have an Account? <span onClick={()=>setState("Login")} className="text-blue-500 underline cursor-pointer">Login here</span></p>
                        :<p>Create a new Account? <span onClick={()=>setState("sign up")} className="text-blue-500 underline cursor-pointer">click here</span></p>
                    }
                </div>
            
        </form>
    );
};

export default Login;