import react,{useContext,useEffect} from "react";
import {AdminContext} from "../../context/adminContext";
import {AppContext} from "../../context/appContext";
import {assets} from "../../assets/assets";
const AllApointments=()=>{
    const {aToken,appointments,getAllAppointment,adminCancelAppointment}=useContext(AdminContext);
    const {calculateAge,slotDateFormat}=useContext(AppContext);

    useEffect(()=>{
        if(aToken){
        getAllAppointment();
        }
    },[aToken])
    return aToken && (<>
    <div className="w-full max-w-6xl m-5">
        <p className="mb-3 text-lg font-medium">All Appointments</p>
        <div className="bg-white border border-gray-200 rounded shadow text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
            <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col px-6 py-3 border-b border-gray-300">
                <p>#</p>
                <p>Patient</p>
                <p>Age</p>
                <p>Date & Time</p>
                <p>Doctor</p>
                <p>Fees</p>
                <p>Actions</p>
            </div>
            {
                appointments.map((item,index)=>{
                    return aToken && (
                    <div className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b border-gray-300 hover:bg-gray-50">
                        <p className="max-sm:hidden">{index+1}</p>
                        <div className="flex items-center gap-2">
                            <img className="w-8 rounded-full" src={item.userData.image} alt=""/><p>{item.userData.name}</p>
                        </div>
                        <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
                        <p>{slotDateFormat(item.slotDate)},{item.slotTime}</p>
                        <div className="flex items-center gap-2">
                            <img className="w-8 rounded-full bg-gray-200" src={item.docData.image} alt=""/><p>{item.docData.name}</p>
                        </div>
                        <p>&#8377;{item.amount}</p>
                        {
                            item.cancelled
                            ?
                            <p className="text-red-400 text-xs font-medium">Cancelled</p>
                            :
                            item.isComplete
                            ?
                            <p className="text-green-400 text-xs font-medium">Completed</p>
                            :
                            <img onClick={()=>adminCancelAppointment(item._id)} className="w-10 cursor-pointer" src={assets.cancel_icon}/>
                        }
                    </div>)
                })
            }
        </div>

    </div>
    </>);
}
export default AllApointments;