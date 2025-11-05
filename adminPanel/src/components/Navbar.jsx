import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { AdminContext } from "../context/adminContext.jsx";
import { DoctorContext } from "../context/doctorContext.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const { aToken, setAToken } = useContext(AdminContext);
    const { dToken, setdToken } = useContext(DoctorContext);
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const logOut = () => {
        navigate("/");
        aToken && setAToken("");
        aToken && localStorage.removeItem("aToken");
        dToken && setdToken("");
        dToken && localStorage.removeItem("dToken");
        setShowDropdown(false);
    };

    const getUserRole = () => {
        if (aToken) return { role: "Administrator", type: "admin" };
        if (dToken) return { role: "Medical Doctor", type: "doctor" };
        return { role: "Guest", type: "guest" };
    };

    const { role, type } = getUserRole();

    const getInitials = () => {
        return type === "admin" ? "A" : type === "doctor" ? "D" : "G";
    };

    const getRoleColor = () => {
        switch (type) {
            case "admin":
                return "bg-gradient-to-r from-purple-500 to-indigo-600";
            case "doctor":
                return "bg-gradient-to-r from-blue-500 to-cyan-600";
            default:
                return "bg-gradient-to-r from-gray-500 to-gray-600";
        }
    };

    return (
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo and Brand */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg">AR</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                    ARHospital
                                </h1>
                                <p className="text-sm text-gray-500 hidden sm:block">
                                    Healthcare Management System
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* User Info and Actions */}
                    <div className="flex items-center space-x-4">
                        {/* User Role Badge */}
                        <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
                            <div className={`w-2 h-2 rounded-full ${type === 'admin' ? 'bg-purple-500' : 'bg-blue-500'} animate-pulse`}></div>
                            <span className="text-sm font-medium text-gray-700 capitalize">
                                {type}
                            </span>
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${getRoleColor()}`}>
                                    {getInitials()}
                                </div>
                                <div className="hidden lg:block text-left">
                                    <p className="text-sm font-medium text-gray-900">
                                        {role}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {type === 'admin' ? 'System Administrator' : 'Healthcare Professional'}
                                    </p>
                                </div>
                                <svg 
                                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setShowDropdown(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in-50 slide-in-from-top-2">
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{role}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {type === 'admin' 
                                                    ? 'Full system access' 
                                                    : 'Medical operations access'
                                                }
                                            </p>
                                        </div>
                                        
                                        {/* Menu Items */}
                                        <div className="py-2">
                                            <button 
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                                onClick={() => {
                                                    setShowDropdown(false);
                                                    navigate(type === 'admin' ? '/admin-dashboard' : '/doctor-dashboard');
                                                }}
                                            >
                                                <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                                Dashboard
                                            </button>
                                            
                                            <button 
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                                onClick={() => {
                                                    setShowDropdown(false);
                                                    navigate(type === 'admin' ? '/doctor-profile' : '/doctor-profile');
                                                }}
                                            >
                                                <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Profile Settings
                                            </button>
                                        </div>
                                        
                                        {/* Logout Button */}
                                        <div className="border-t border-gray-100 pt-2">
                                            <button
                                                onClick={logOut}
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                                            >
                                                <svg className="w-4 h-4 mr-3 text-red-500 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;