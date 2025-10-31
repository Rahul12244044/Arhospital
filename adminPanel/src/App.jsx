import react,{useContext} from "react";
import Login from "./pages/Login.jsx";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {AdminContext} from "./context/adminContext.jsx";
import {DoctorContext} from "./context/doctorContext.jsx";
import Navbar from "./components/Navbar.jsx";
import SideBar from "./components/sideBar.jsx";
import {Routes,Route} from "react-router-dom";
import DashBoard from "./pages/Admin/Dashboard.jsx";
import AllApointments from "./pages/Admin/AllAppointments.jsx";
import DoctorAdd from "./pages/Admin/doctorAdd.jsx";
import DoctorList from "./pages/Admin/doctorList.jsx";
import DoctorAppointment from "./pages/Doctor/doctorAppointments.jsx";
import DoctorProfile from "./pages/Doctor/doctorProfile.jsx";
import DoctorDashboard from "./pages/Doctor/doctorDashboard.jsx";
const App=()=>{
  const {aToken}=useContext(AdminContext);
  const {dToken}=useContext(DoctorContext);
  console.log("aToken: ");
  console.log(aToken);
  return aToken || dToken?(
    <>
    <div className="bg-[#F8F9FD]">
    <ToastContainer position="top-right" autoClose={3000} />
    <Navbar/>
    <div className="flex items-start">
      <SideBar/>
      <Routes>
        <Route path="/" element={<></>}/>
        <Route path="/admin-dashboard" element={<DashBoard/>}/>
        <Route path="/all-appointments" element={<AllApointments/>}/>
        <Route path="/add-doctors" element={<DoctorAdd/>}/>
        <Route path="/doctor-list" element={<DoctorList/>}/>
        <Route path="/doctor-appointments" element={<DoctorAppointment/>}/>
        <Route path="/doctor-profile" element={<DoctorProfile/>}/>
        <Route path="/doctor-dashboard" element={<DoctorDashboard/>}/>
      </Routes>
    </div>
    </div>
    </>
  ):(
    <>
    <Login/>
    <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}
export default App;