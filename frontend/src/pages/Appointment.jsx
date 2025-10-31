import React,{useContext,useState,useEffect} from 'react';
import {useParams,useNavigate} from "react-router-dom";
import {assets} from "../assets/allAssets";
import {AppContext} from "../context/AppContext";
import {toast} from "react-toastify";
import axios from "axios";
import RelatedDoctors from "../components/relatedDoctors";
import Footer from "../components/footer";
const Appintment = () => {
    const {docId}=useParams();
    const {doctors,getDoctorsData,aToken}=useContext(AppContext);
    console.log("docId: "+docId);
    console.log("doctors: ");
    console.log(doctors);
    const [docInfo,setDocInfo]=useState(null);
    const [docSlot,setDocSlot]=useState([]);
    const [slotIndex,setSlotIndex]=useState(0);
    const [slotTime,setSlotTime]=useState('');
    const navigate=useNavigate();
    const dayOfWeek=['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const fetchDocInfo=()=>{
        const docInfo=doctors.find((elm,index)=>elm._id===docId);
        console.log("docInfo: ");
        console.log(docInfo);
        setDocInfo(docInfo);
    }
    const bookAppointment=async ()=>{
        try{
            if(!aToken){
                toast.warn("Login to book appointment.");
                return navigate("/login");
            }
            if (!slotTime) {
            toast.warn("Please select a time slot.");
            return;
            }
           const date=docSlot[slotIndex][0].datetime;
           let day=date.getDate();
           let month=date.getMonth()+1;
           let year=date.getFullYear();
           const slotDate=day+"-"+month+"-"+year;
           console.log("book appointment @@@@@@@@@@@@@@@@@@@@@@@");
           console.log(slotDate);
           const {data}=await axios.post("https://arhospital.onrender.com/api/user/book-appointment",{docId,slotDate,slotTime},{headers:{token:aToken}});
           if(data.success){
            toast.success(data.message);
            getDoctorsData();
            navigate("/myAppointments");
           }else{
            toast.error(data.message);
           }
        }catch(err){
            toast.error(err.message);
        }
    }
    const availableSlots=()=>{
        if (!docInfo || !docInfo.slots_booked) return;
        //1) get the current date
        const today=new Date();
        console.log("today: ");
        console.log(today);
        for(let r=0;r<7;r++){
            let currentDate=new Date(today);
            console.log("currentDate: ");
            console.log(currentDate);
            currentDate.setDate(today.getDate()+r);
            //2) end time of the date with index
            let endTime=new Date();
            endTime.setDate(today.getDate()+r);
            endTime.setHours(21,0,0,0);
            //3 hours
            if(today.getDate()===currentDate.getDate()){
                currentDate.setHours(currentDate.getHours()>10?currentDate.getHours()+1:10);
                currentDate.setMinutes(currentDate.getMinutes()>30?30:0);
            }else{
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }
            let timeSlots=[];
            while(currentDate<endTime){
                let formatDate=currentDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
                let day=currentDate.getDate();
                let month=currentDate.getMonth()+1;
                let year=currentDate.getFullYear();
                let slotDate=day+"-"+month+"-"+year;
                let slotTime=formatDate;
                const isAvailableSlot=docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime)?false:true;
                if(isAvailableSlot){
                timeSlots.push({
                    datetime:new Date(currentDate),
                    time:formatDate
                });
            }
                currentDate.setMinutes(currentDate.getMinutes()+30);
            }
            setDocSlot(prev=>[...prev,timeSlots]);
        }
    }
    useEffect(()=>{
        console.log("is useEffect run: ");
        fetchDocInfo();
    },[doctors,docId]);
    useEffect(()=>{
        if(docInfo){
        availableSlots();
        }
    },[docInfo]);
    useEffect(()=>{
        console.log(docSlot);
    },[docSlot]);

    return docInfo && (
       
        <div>
            <div className="flex flex-col sm:flex-row gap-4">
                <div>
                    <img className="bg-blue-500 sm:max-w-72 rounded-lg" src={docInfo.image} alt=""/>
                </div>
                <div className="flex-1 border border-gray-500 rounded-lg py-8 px-7 bg-white sm:mx-0 mt-[-80px] sm:mt-0">
                    <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">{docInfo.name} <img className="w-5" src={assets.verified_icon}/></p>
                <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                    <p>{docInfo.degree}-{docInfo.speciality}</p>
                    <button className="border border-gray-200 rounded-full px-2 py-0.5 text-xs cursor-pointer">{docInfo.experience} year</button>
                </div>
                <div>
                    <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">About <img src={assets.info_icon}/></p>
                    <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
                </div>
                <p className="font-medium text-gray-900 mt-4">Appointment fee: <span className="text-gray-600">&#8377; {docInfo.fees}</span></p>
            </div>
        </div>
        {/*-Booking slots-*/}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
            <p>Booking slots</p>
            <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                {
                    docSlot.length && docSlot.map((item,index)=>{
                        return (
                            <>
                            {item.length!=0 && index<7?
                            <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer border ${slotIndex===index?'bg-blue-500 text-white':'border border-gray-200'}`} key={index}>
                                <p>{item[0] && dayOfWeek[item[0].datetime.getDay()]}</p>
                                <p>{item[0] && item[0].datetime.getDate()}</p>
                            </div>
                            :null}
                            </>
                        )
                    })
                }
            </div>
            <div className="flex items-center gap-3 w-full mt-4 overflow-x-scroll">
                {
                    docSlot.length && docSlot[slotIndex].map((item,index)=>{
                        return (<p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime?'bg-blue-500 text-white':'text-gray-400 border border-gray-300'}`} key={index}>
                            {item.time.toLowerCase()}
                        </p>
                        )
                    })
                }
            </div>
            <button onClick={bookAppointment} className="bg-blue-500 text-white rounded-full py-3 my-6 px-14 cursor-pointer">Book an appointment</button>
        </div>
        <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
        <Footer/>
        </div>
        
    );
};

export default Appintment;