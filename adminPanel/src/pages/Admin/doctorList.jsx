import react,{useEffect,useContext} from "react";
import {AdminContext} from "../../context/adminContext";

const DoctorList=()=>{
    const {aToken,doctors,getAllDoctors,changeAvailability}=useContext(AdminContext);
    console.log("aToken in the DoctorList: ");
    console.log(aToken);
    useEffect(()=>{
    getAllDoctors();
    console.log("doctors: ");
    console.log(doctors);
    },[aToken])
    return (
    <>
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
        <h1 className="text-lg font-medium">All Doctors</h1>
        <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {
            doctors.map((item,index)=>{
                return (
                <div className="border border-indigo-200 rounded-xl max-w-51 overflow-hidden group cursor-pointer" key={index}>
                    <img className="bg-indigo-50 group-hover:bg-blue-500 transition-all duration-500" src={item.image} alt=""/>
                    <div className="p-4">
                        <p className="text-neutral-800 text-lg font-medium">{item.name}</p>
                        <p className="text-zinc-600 text-sm">{item.speciality}</p>
                        <div className="mt-2 flex items-center gap-1 text-sm">
                            <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available}/>
                            <p>Available</p>
                        </div>
                    </div>
                </div>)
            })
        }
        </div>
    </div>
    </>);
}
export default DoctorList;