import React,{useState,useContext} from 'react';
import {assets} from "../assets/allAssets";
import Footer from "../components/footer";
import {AppContext} from "../context/AppContext";
import axios from "axios";
import {toast} from "react-toastify";
const MyProfile = () => {
    const {userData,setUserData,aToken,loadUserData}=useContext(AppContext);
    const [isEdit,setIsEdit]=useState(true);
    const [image,setImage]=useState(false);
    const updateUserProfileData=async ()=>{
        try{
            const formData=new FormData();
            formData.append("name",userData.name);
            formData.append("phone",userData.phone);
            formData.append("address",JSON.stringify(userData.address));
            formData.append("gender",userData.gender);
            formData.append("dob",userData.dob);
            image && formData.append("image",image);
            const {data}=await axios.post("https://arhospital.onrender.com/api/user/update-profile",formData,{headers:{token:aToken}});
            if(data.success){
                toast.success(data.message);
                loadUserData();
                setIsEdit(false);
                setImage(false);
            }else{
                toast.error(data.message);
            }

        }catch(err){
            toast.error(err.message);
        }
    }
    return userData && (
        <>
        <div className="max-w-lg flex flex-col gap-2 text-sm">
            {
                isEdit
                ?
                <label htmlFor="image">
                    <div className="inline-block relative cursor-pointer">
                        <img className="w-36 rounded opacity-85" src={image?URL.createObjectURL(image):userData.image} alt=""/>
                        <img className="w-10 shadow-xl absolute bottom-12 right-12" src={image?"":assets.upload_icon} alt=""/>
                    </div>
                    <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden/>
                </label>
                :
                <img className="w-36 rounded" src={userData.image}/>
            }
            {
                isEdit?
                <input className="bg-gray-50 text-3xl border border-gray-300 px-1 font-medium max-w-60 mt-4" type="text" value={userData.name} onChange={(event)=>setUserData((prev)=>({...prev,name:event.target.value}))}/>
                :
                <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.name}</p>
            }
            <hr className="bg-zinc-400 h-[1px] border-none"/>
            <div>
                <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
                    <p className="font-medium">Email id:</p>
                    <p className="text-blue-500">{userData.email}</p>
                    <p className="font-medium">Phone:</p>
                    {
                    isEdit?
                    <input className="bg-gray-100 max-w-52 border border-gray-300 px-1" type="text" value={userData.phone} onChange={(event)=>setUserData((prev)=>({...prev,phone:event.target.value}))}/>
                    :
                    <p className="text-blue-400">{userData.phone}</p>
                    }
                    <p className="font-medium">Address:</p>
                    {
                    isEdit?
                    <p>
                    <input className="bg-gray-100 border border-gray-300 px-1" type="text" value={userData.address.line1} onChange={(event)=>setUserData((prev)=>({...prev,address:{...prev.address,line1:event.target.value}}))}/>
                    <br className="mt-1"/>
                    <input className="bg-gray-100 mt-1 border border-gray-300 px-1" type="text" value={userData.address.line2} onChange={(event)=>setUserData((prev)=>({...prev,address:{...prev.address,line2:event.target.value}}))}/>
                    </p>
                    :
                    <p className="text-gray-500">
                        {userData.address.line1}
                        <br/>
                        {userData.address.line2}
                    </p>
                    }
                </div>
            </div>
            <div>
                <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
                    <p className="font-medium">Gender:</p>
                     {
                    isEdit?
                    <select className="max-w-20 bg-gray-100 border border-gray-300 px-1" onChange={(event)=>setUserData((prev)=>({...prev,gender:event.target.value}))} value={userData.gender}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    :
                    <p className="text-gray-400">{userData.gender}</p>
                    }
                    <p className="font-medium">Birthday:</p>
                    {
                        isEdit?
                        <input className="max-w-28 bg-gray-100 border border-gray-300 px-1" type="date" onChange={(event)=>setUserData((prev)=>({...prev,dob:event.target.value}))} value={userData.dob}/>
                        :
                        <p className="text-gray-400">{userData.dob}</p>
                    }
                </div>
            </div>
            <div className="mt-10">
                {
                isEdit?
                <button className="border border-blue-500 px-8 py-2 rounded-full  cursor-pointer hover:bg-blue-500 hover:text-white transition-all" onClick={updateUserProfileData}>Save Information</button>
                :
                <button className="border border-blue-500 px-8 py-2 rounded-full cursor-pointer hover:bg-blue-500 hover:text-white transition-all" onClick={()=>setIsEdit(true)}>Edit</button>
                }
            </div>
        </div>
        <Footer/>
        </>
    );
};

export default MyProfile;