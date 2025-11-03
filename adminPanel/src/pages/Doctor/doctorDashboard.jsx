import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/doctorContext";
import { AppContext } from "../../context/appContext";
import { assets } from "../../assets/assets";

const DoctorDashboard = () => {
    const { dashData, setDashData, dToken, doctorDashboard, cancelAppointment, completeAppointment } = useContext(DoctorContext);
    const { slotDateFormat } = useContext(AppContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (dToken) {
            setLoading(true);
            doctorDashboard().finally(() => setLoading(false));
        }
    }, [dToken]);

    

    if (!dashData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">📊</div>
                    <h2 className="text-xl font-semibold text-gray-600 mb-2">No Data Available</h2>
                    <p className="text-gray-500">Dashboard data is not available at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
                    <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Welcome back! Here's your practice overview.</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {/* Earnings Card */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-xs sm:text-sm font-medium">Total Earnings</p>
                                <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2">₹{dashData.earnings?.toLocaleString() || '0'}</p>
                                <p className="text-blue-100 text-xs mt-1 sm:mt-2">This month</p>
                            </div>
                            <div className="bg-blue-400 bg-opacity-30 p-2 sm:p-4 rounded-full">
                                <img className="w-6 h-6 sm:w-8 sm:h-8 filter brightness-0 invert" src={assets.earning_icon} alt="Earnings" />
                            </div>
                        </div>
                    </div>

                    {/* Appointments Card */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-xs sm:text-sm font-medium">Appointments</p>
                                <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2">{dashData.appointments}</p>
                                <p className="text-green-100 text-xs mt-1 sm:mt-2">Scheduled</p>
                            </div>
                            <div className="bg-green-400 bg-opacity-30 p-2 sm:p-4 rounded-full">
                                <img className="w-6 h-6 sm:w-8 sm:h-8 filter brightness-0 invert" src={assets.appointments_icon} alt="Appointments" />
                            </div>
                        </div>
                    </div>

                    {/* Patients Card */}
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-xs sm:text-sm font-medium">Total Patients</p>
                                <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2">{dashData.patients}</p>
                                <p className="text-purple-100 text-xs mt-1 sm:mt-2">Active patients</p>
                            </div>
                            <div className="bg-purple-400 bg-opacity-30 p-2 sm:p-4 rounded-full">
                                <img className="w-6 h-6 sm:w-8 sm:h-8 filter brightness-0 invert" src={assets.patients_icon} alt="Patients" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Latest Bookings Section */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                    {/* Section Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
                                <img className="w-4 h-4 sm:w-5 sm:h-5" src={assets.list_icon} alt="Bookings" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Latest Bookings</h2>
                                <p className="text-gray-600 text-xs sm:text-sm">Recent patient appointments</p>
                            </div>
                        </div>
                    </div>

                    {/* Appointments List */}
                    <div className="divide-y divide-gray-100">
                        {dashData.latestAppointment?.length > 0 ? (
                            dashData.latestAppointment.map((item, index) => (
                                <div key={index} className="px-3 sm:px-6 py-3 sm:py-4 hover:bg-blue-50 transition-colors duration-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        {/* Patient Info */}
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="relative flex-shrink-0">
                                                <img 
                                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-sm aspect-square" 
                                                    src={item.userData.image || '/default-avatar.png'} 
                                                    alt={item.userData.name}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/48?text=U';
                                                    }}
                                                />
                                                {item.isCompleted && (
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                        <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {item.cancelled && (
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                                                        <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-800 text-sm truncate">{item.userData.name}</h3>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-600 text-xs mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="truncate">{slotDateFormat(item.slotDate)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>{item.slotTime}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status and Actions */}
                                        <div className="flex items-center justify-between sm:justify-end gap-2">
                                            {item.cancelled ? (
                                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full border border-red-200 whitespace-nowrap">
                                                    Cancelled
                                                </span>
                                            ) : item.isCompleted ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200 whitespace-nowrap">
                                                    Completed
                                                </span>
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => cancelAppointment(item._id)}
                                                        className="p-1.5 sm:p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200"
                                                        title="Cancel Appointment"
                                                    >
                                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => completeAppointment(item._id)}
                                                        className="p-1.5 sm:p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200 border border-green-200"
                                                        title="Complete Appointment"
                                                    >
                                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 sm:py-12">
                                <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📅</div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-1 sm:mb-2">No Appointments</h3>
                                <p className="text-gray-500 text-sm sm:text-base">You don't have any appointments scheduled yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {dashData.latestAppointment?.length > 0 && (
                        <div className="bg-gray-50 px-3 sm:px-6 py-2 sm:py-3 border-t border-gray-200">
                            <p className="text-gray-600 text-xs sm:text-sm text-center">
                                Showing {dashData.latestAppointment.length} recent appointments
                            </p>
                        </div>
                    )}
                </div>

                {/* Quick Stats Footer */}
                
            </div>
        </div>
    );
};

export default DoctorDashboard;