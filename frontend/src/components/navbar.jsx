import React, { useState, useContext, useEffect, useRef } from 'react';
import { assets } from "../assets/allAssets.js";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { FaHospital, FaChevronDown, FaUser, FaCalendarAlt, FaSignOutAlt, FaExternalLinkAlt } from 'react-icons/fa';

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const { aToken, setAToken, userData } = useContext(AppContext);
    const [showDropdownList, setShowDropdownList] = useState(false);
    const dropdownRef = useRef(null);
    const adminPanelURL = "https://adminpanelarhospitalar.netlify.app/";

    const logOut = () => {
        localStorage.removeItem("token");
        setAToken(false);
        setShowDropdownList(false);
    };

    // Hide dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdownList(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (showMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showMenu]);

    return (
        <div className="flex items-center justify-between text-base py-5 px-4 sm:px-6 lg:px-8 bg-white  border-b border-gray-100 relative">
            {/* Logo */}
            <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-md">
                    <FaHospital className="text-white w-6 h-6" />
                </div>
                <span className="ml-3 font-bold text-2xl bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                    ARHospital
                </span>
            </div>
            
            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center font-medium gap-8">
                <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                        `py-2 transition-all duration-200 border-b-2 ${
                            isActive 
                            ? 'text-blue-600 border-blue-600 font-semibold' 
                            : 'text-gray-600 border-transparent hover:text-blue-500 hover:border-blue-300'
                        }`
                    }
                >
                    <li>HOME</li>
                </NavLink>
                <NavLink 
                    to="/doctors" 
                    className={({ isActive }) => 
                        `py-2 transition-all duration-200 border-b-2 ${
                            isActive 
                            ? 'text-blue-600 border-blue-600 font-semibold' 
                            : 'text-gray-600 border-transparent hover:text-blue-500 hover:border-blue-300'
                        }`
                    }
                >
                    <li>ALL DOCTORS</li>
                </NavLink>
                <NavLink 
                    to="/about" 
                    className={({ isActive }) => 
                        `py-2 transition-all duration-200 border-b-2 ${
                            isActive 
                            ? 'text-blue-600 border-blue-600 font-semibold' 
                            : 'text-gray-600 border-transparent hover:text-blue-500 hover:border-blue-300'
                        }`
                    }
                >
                    <li>ABOUT</li>
                </NavLink>
                <NavLink 
                    to="/contact" 
                    className={({ isActive }) => 
                        `py-2 transition-all duration-200 border-b-2 ${
                            isActive 
                            ? 'text-blue-600 border-blue-600 font-semibold' 
                            : 'text-gray-600 border-transparent hover:text-blue-500 hover:border-blue-300'
                        }`
                    }
                >
                    <li>CONTACT</li>
                </NavLink>

                <li>
                    <button
                        onClick={() => window.open(adminPanelURL, "_blank")}
                        className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 shadow-sm px-5 py-2.5 rounded-lg hover:shadow-md hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-all duration-200 group"
                    >
                        <span className="text-sm font-medium">Admin Panel</span>
                        <FaExternalLinkAlt className="w-3 h-3 group-hover:text-blue-600 transition-colors" />
                    </button>
                </li>
            </ul>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
                {aToken ? (
                    <div className="relative" ref={dropdownRef}>
                        {/* User Avatar and Dropdown Toggle */}
                        <div
                            className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => setShowDropdownList((prev) => !prev)}
                        >
                            <div className="relative">
                                <img
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-colors shadow-sm"
                                    src={userData?.image || assets.user_icon}
                                    alt="user profile"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <FaChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${showDropdownList ? 'rotate-180' : ''}`} />
                        </div>

                        {/* Dropdown Menu */}
                        {showDropdownList && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg z-50 py-3 flex flex-col border border-gray-100 overflow-hidden">
                                {/* User Info */}
                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                    <p className="font-semibold text-gray-900 text-sm truncate">
                                        {userData?.name || 'User'}
                                    </p>
                                    <p className="text-gray-500 text-xs truncate mt-1">
                                        {userData?.email || 'user@example.com'}
                                    </p>
                                </div>
                                
                                {/* Menu Items */}
                                <div
                                    onClick={() => {
                                        navigate("/myProfile");
                                        setShowDropdownList(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer group transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        <FaUser className="w-3.5 h-3.5 text-blue-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium text-sm group-hover:text-blue-600 transition-colors">
                                        My Profile
                                    </span>
                                </div>
                                
                                <div
                                    onClick={() => {
                                        navigate("/myAppointments");
                                        setShowDropdownList(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer group transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                        <FaCalendarAlt className="w-3.5 h-3.5 text-green-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium text-sm group-hover:text-green-600 transition-colors">
                                        My Appointments
                                    </span>
                                </div>
                                
                                <div className="border-t border-gray-100 mt-1 pt-1">
                                    <div
                                        onClick={logOut}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 cursor-pointer group transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                            <FaSignOutAlt className="w-3.5 h-3.5 text-red-600" />
                                        </div>
                                        <span className="text-gray-700 font-medium text-sm group-hover:text-red-600 transition-colors">
                                            Logout
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => navigate("/login")}
                        className="hidden lg:flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl px-6 py-3 cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
                    >
                        Create account
                    </button>
                )}

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setShowMenu(true)}
                    className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                >
                    <img
                        className="w-5 h-5"
                        src={assets.menu_icon}
                        alt="menu"
                    />
                </button>

                {/* Mobile Sidebar Menu */}
                <div
                    className={`fixed inset-0 z-50 transform transition-all duration-300 ease-in-out ${
                        showMenu ? 'translate-x-0' : 'translate-x-full'
                    } md:hidden`}
                >
                    {/* Backdrop */}
                    {showMenu && (
                        <div 
                            className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
                            onClick={() => setShowMenu(false)}
                        ></div>
                    )}
                    
                    {/* Sidebar Content */}
                    <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-xl overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                                    <FaHospital className="text-white w-5 h-5" />
                                </div>
                                <span className="ml-3 font-bold text-xl bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                                    ARHospital
                                </span>
                            </div>
                            <button
                                onClick={() => setShowMenu(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <img
                                    className="w-5 h-5"
                                    src={assets.cross_icon}
                                    alt="close"
                                />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="py-6 px-6">
                            <ul className="space-y-2">
                                {[
                                    { path: "/", label: "HOME" },
                                    { path: "/doctors", label: "ALL DOCTORS" },
                                    { path: "/about", label: "ABOUT" },
                                    { path: "/contact", label: "CONTACT" }
                                ].map((item) => (
                                    <li key={item.path}>
                                        <NavLink 
                                            onClick={() => setShowMenu(false)} 
                                            to={item.path}
                                            className={({ isActive }) => 
                                                `block py-3 px-4 rounded-xl transition-all duration-200 font-medium ${
                                                    isActive 
                                                    ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`
                                            }
                                        >
                                            {item.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>

                            {/* Admin Panel Button */}
                            <button
                                onClick={() => {
                                    window.open(adminPanelURL, "_blank");
                                    setShowMenu(false);
                                }}
                                className="w-full flex items-center justify-center gap-2 mt-6 bg-white border border-gray-200 text-gray-700 px-4 py-3.5 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-200 font-medium shadow-sm"
                            >
                                <span>Admin Panel</span>
                                <FaExternalLinkAlt className="w-3 h-3" />
                            </button>

                            {/* User Section */}
                            {aToken ? (
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => {
                                                navigate("/myProfile");
                                                setShowMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors text-gray-700 font-medium text-left"
                                        >
                                            <FaUser className="w-4 h-4 text-blue-600" />
                                            My Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate("/myAppointments");
                                                setShowMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-green-50 transition-colors text-gray-700 font-medium text-left"
                                        >
                                            <FaCalendarAlt className="w-4 h-4 text-green-600" />
                                            My Appointments
                                        </button>
                                        <button
                                            onClick={() => {
                                                logOut();
                                                setShowMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-red-50 transition-colors text-gray-700 font-medium text-left mt-4"
                                        >
                                            <FaSignOutAlt className="w-4 h-4 text-red-600" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        navigate("/login");
                                        setShowMenu(false);
                                    }}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl px-4 py-3.5 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium mt-8"
                                >
                                    Create account
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;