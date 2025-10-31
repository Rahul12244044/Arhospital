import React, { useState, useContext, useEffect, useRef } from 'react';
import { assets } from "../assets/allAssets.js";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { FaHospital } from 'react-icons/fa'; // FontAwesome hospital icon

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const { aToken, setAToken, userData } = useContext(AppContext);
    const [showDropdownList, setShowDropdownList] = useState(false);
    const dropdownRef = useRef(null); // reference for dropdown
    const adminPanelURL = "https://adminpanelarhosital.netlify.app/";

    const logOut = () => {
        localStorage.removeItem("token");
        setAToken(false);
        setShowDropdownList(false);
    };

    // 🧠 Hide dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdownList(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex items-center justify-between text-base py-4 mb-5 border-b border-b-gray-400 relative">
 <div className="flex items-center">
      <FaHospital className="text-blue-600 w-10 h-10" /> {/* size 40px */}
      <span className="ml-2 font-bold text-2xl text-blue-900">
        ARHospital
      </span>
    </div>
            {/* Desktop Menu */}
            <ul className="hidden md:flex items-start font-semibold gap-5">
                <NavLink to="/"><li className="py-1">HOME</li></NavLink>
                <NavLink to="/doctors"><li className="py-1">ALL DOCTORS</li></NavLink>
                <NavLink to="/about"><li className="py-1">ABOUT</li></NavLink>
                <NavLink to="/contact"><li className="py-1">CONTACT</li></NavLink>

                <li>
                    <button
                        onClick={() => window.open(adminPanelURL, "_blank")}
                        className="bg-white text-xs border border-gray-300 shadow px-5 py-2 rounded-full hover:bg-blue-600 hover:text-white cursor-pointer transition-all"
                    >
                        Admin Panel
                    </button>
                </li>
            </ul>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                {aToken ? (
                    <div className="relative" ref={dropdownRef}>
                        {/* Avatar and Dropdown Toggle */}
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setShowDropdownList((prev) => !prev)}
                        >
                            <img
                                className="w-8 h-8 rounded-full object-cover border border-gray-300"
                                src={userData?.image || assets.user_icon}
                                alt="user"
                            />
                            <img className="w-3" src={assets.dropdown_icon} alt="dropdown" />
                        </div>

                        {/* Dropdown List */}
                        {showDropdownList && (
                            <div className="absolute right-0 mt-2 w-48 bg-stone-100 rounded-lg shadow-lg z-50 p-4 flex flex-col gap-3 text-gray-700 font-medium">
                                <p
                                    onClick={() => {
                                        navigate("/myProfile");
                                        setShowDropdownList(false);
                                    }}
                                    className="hover:text-black cursor-pointer"
                                >
                                    My Profile
                                </p>
                                <p
                                    onClick={() => {
                                        navigate("/myAppointments");
                                        setShowDropdownList(false);
                                    }}
                                    className="hover:text-black cursor-pointer"
                                >
                                    My Appointments
                                </p>
                                <p
                                    onClick={logOut}
                                    className="hover:text-black cursor-pointer"
                                >
                                    Logout
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                    onClick={() => navigate("/login")}
                    className="text-sm bg-blue-500 text-white rounded-full px-8 py-3 m-auto cursor-pointer hidden lg:block hover:bg-blue-600 transition-all"
                    >
                    Create account
                    </button>

                )}

                {/* Mobile Menu Icon */}
                <img
                    onClick={() => setShowMenu(true)}
                    className="w-6 md:hidden cursor-pointer"
                    src={assets.menu_icon}
                    alt="menu"
                />

                {/* Mobile Sidebar Menu */}
                <div
                    className={`${showMenu ? "fixed w-full" : "h-0 w-0"} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
                >
                    <div className="flex items-center justify-between px-5 py-6">
                       <span className="ml-2 font-bold text-2xl text-blue-900">
                       ARHospital
                       </span>
                        <img
                            className="w-7 cursor-pointer"
                            onClick={() => setShowMenu(false)}
                            src={assets.cross_icon}
                            alt="close"
                        />
                    </div>

                    <ul className="flex flex-col items-center gap-4 mt-5 px-5 text-lg font-medium">
                        <NavLink onClick={() => setShowMenu(false)} to="/">HOME</NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to="/doctors">ALL DOCTORS</NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to="/about">ABOUT</NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to="/contact">CONTACT</NavLink>

                        <button
                            onClick={() => {
                                window.open(adminPanelURL, "_blank");
                                setShowMenu(false);
                            }}
                            className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition-all"
                        >
                            Admin Panel
                        </button>

                        {aToken && (
                            <div className="mt-4 w-full flex flex-col items-center gap-3">
                                <p
                                    onClick={() => {
                                        navigate("/myProfile");
                                        setShowMenu(false);
                                    }}
                                    className="hover:text-blue-600 cursor-pointer"
                                >
                                    My Profile
                                </p>
                                <p
                                    onClick={() => {
                                        navigate("/myAppointments");
                                        setShowMenu(false);
                                    }}
                                    className="hover:text-blue-600 cursor-pointer"
                                >
                                    My Appointments
                                </p>
                                <p
                                    onClick={() => {
                                        logOut();
                                        setShowMenu(false);
                                    }}
                                    className="hover:text-blue-600 cursor-pointer"
                                >
                                    Logout
                                </p>
                            </div>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
