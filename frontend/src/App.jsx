import React from 'react';
import {Routes,Route} from "react-router-dom";
import Home from "./pages/home.jsx";
import Doctors from "./pages/Doctors.jsx"
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx"
import MyAppointments from "./pages/MyAppointments.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import Appointment from "./pages/Appointment.jsx"
import Login from "./pages/Login.jsx";
import Navbar from "../src/components/navbar.jsx";
import HealthMonitor from "../src/pages/healthSystem.jsx"
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const App = () => {
    return (
        <div className="mx-4 sm:mx-[10%] ">
          <ToastContainer position="top-right" autoClose={3000} />
          <Navbar/>
          <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/doctors' element={<Doctors/>}></Route>
            <Route path='/doctors/:speciality' element={<Doctors/>}></Route>
            <Route path='/about' element={<About/>}></Route>
            <Route path='/contact' element={<Contact/>}></Route>
            <Route path='/myAppointments' element={<MyAppointments/>}></Route>
            <Route path='/appointment/:docId' element={<Appointment/>}></Route>
            <Route path='/myProfile' element={<MyProfile/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path="/health-monitor" element={<HealthMonitor />} />
          </Routes>  
        </div>
    );
};

export default App;
