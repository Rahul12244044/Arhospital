import React, { useContext, useState } from "react";
import { AdminContext } from "../context/adminContext";
import { DoctorContext } from "../context/doctorContext";
import { NavLink, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";

const SideBar = () => {
    const { aToken } = useContext(AdminContext);
    const { dToken } = useContext(DoctorContext);
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const adminMenuItems = [
        { path: "/admin-dashboard", icon: assets.home_icon, label: "Dashboard" },
        { path: "/all-appointments", icon: assets.appointment_icon, label: "Appointments" },
        { path: "/add-doctors", icon: assets.add_icon, label: "Add Doctor" },
        { path: "/doctor-list", icon: assets.people_icon, label: "Doctor List" }
    ];

    const doctorMenuItems = [
        { path: "/doctor-dashboard", icon: assets.home_icon, label: "Dashboard" },
        { path: "/doctor-appointments", icon: assets.appointment_icon, label: "Appointments" },
        { path: "/doctor-feedback", icon: assets.feedback_icon || assets.people_icon, label: "Patient Feedback" },
        { path: "/doctor-profile", icon: assets.people_icon, label: "Profile" }
    ];

    const menuItems = aToken ? adminMenuItems : dToken ? doctorMenuItems : [];

    const NavItem = ({ item, isActive }) => (
        <NavLink
            to={item.path}
            className={`
                flex items-center gap-4 py-4 px-6 rounded-xl transition-all duration-300 group
                ${isActive 
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1"
                }
            `}
            onClick={() => setIsMobileMenuOpen(false)}
        >
            <div className={`
                p-2 rounded-lg transition-colors duration-300
                ${isActive 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                }
            `}>
                <img 
                    src={item.icon} 
                    alt={item.label}
                    className="w-5 h-5"
                />
            </div>
            <span className="font-medium transition-all duration-300">{item.label}</span>
            
            {/* Active indicator dot */}
            {isActive && (
                <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            )}
        </NavLink>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                    <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                        <div className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                        <div className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
                        <div className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                    </div>
                </button>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-40
                bg-white border-r border-gray-200
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                w-80 lg:w-72 xl:w-80
            `}>
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">M</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                {aToken ? "Admin Panel" : "Doctor Portal"}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {aToken ? "Healthcare Management" : "Medical Professional"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="p-4">
                    <nav className="space-y-2">
                        {menuItems.map((item, index) => (
                            <NavItem 
                                key={index}
                                item={item}
                                isActive={location.pathname === item.path}
                            />
                        ))}
                    </nav>
                </div>

                {/* User Info Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                                {aToken ? "A" : "D"}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {aToken ? "Administrator" : "Medical Doctor"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {aToken ? "System Manager" : "Healthcare Provider"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SideBar;