import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/adminContext";
import { AppContext } from "../../context/appContext";
import { assets } from "../../assets/assets";

const DashBoard = () => {
    const { getDashData, dashData, aToken, adminCancelAppointment } = useContext(AdminContext);
    const { slotDateFormat } = useContext(AppContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (aToken) {
            setLoading(true);
            getDashData().finally(() => setLoading(false));
        }
    }, [aToken]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

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
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">Overview of hospital operations and appointments</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Doctors Card */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Doctors</p>
                                <p className="text-3xl font-bold mt-2">{dashData.doctors}</p>
                                <p className="text-blue-100 text-xs mt-2">Active physicians</p>
                            </div>
                            <div className="bg-blue-400 bg-opacity-30 p-4 rounded-full">
                                <img className="w-8 h-8 filter brightness-0 invert" src={assets.doctor_icon} alt="Doctors" />
                            </div>
                        </div>
                    </div>

                    {/* Appointments Card */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Appointments</p>
                                <p className="text-3xl font-bold mt-2">{dashData.appointments}</p>
                                <p className="text-green-100 text-xs mt-2">Scheduled</p>
                            </div>
                            <div className="bg-green-400 bg-opacity-30 p-4 rounded-full">
                                <img className="w-8 h-8 filter brightness-0 invert" src={assets.appointments_icon} alt="Appointments" />
                            </div>
                        </div>
                    </div>

                    {/* Patients Card */}
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Total Patients</p>
                                <p className="text-3xl font-bold mt-2">{dashData.patients}</p>
                                <p className="text-purple-100 text-xs mt-2">Registered patients</p>
                            </div>
                            <div className="bg-purple-400 bg-opacity-30 p-4 rounded-full">
                                <img className="w-8 h-8 filter brightness-0 invert" src={assets.patients_icon} alt="Patients" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-orange-600">{dashData.todayAppointments || 0}</div>
                        <div className="text-gray-600 text-sm">Today</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-blue-600">{dashData.pendingAppointments || 0}</div>
                        <div className="text-gray-600 text-sm">Pending</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-green-600">{dashData.completedAppointments || 0}</div>
                        <div className="text-gray-600 text-sm">Completed</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-red-600">{dashData.cancelledAppointments || 0}</div>
                        <div className="text-gray-600 text-sm">Cancelled</div>
                    </div>
                </div>

                {/* Latest Bookings Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Section Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <img className="w-5 h-5" src={assets.list_icon} alt="Bookings" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">Latest Bookings</h2>
                                    <p className="text-gray-600 text-sm">Recent appointment activities</p>
                                </div>
                            </div>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {dashData.latestAppointment?.length || 0} appointments
                            </span>
                        </div>
                    </div>

                    {/* Appointments List */}
                    <div className="divide-y divide-gray-100">
                        {dashData.latestAppointment?.length > 0 ? (
                            dashData.latestAppointment.map((item, index) => (
                                <div key={item._id || index} className="px-6 py-4 hover:bg-blue-50 transition-colors duration-200">
                                    <div className="flex items-center justify-between">
                                        {/* Doctor & Appointment Info */}
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="relative">
                                                <img 
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" 
                                                    src={item.docData.image} 
                                                    alt={item.docData.name}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/48?text=DR';
                                                    }}
                                                />
                                                {item.cancelled && (
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-semibold text-gray-800 text-sm">{item.docData.name}</h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        item.cancelled 
                                                            ? 'bg-red-100 text-red-800 border border-red-200' 
                                                            : 'bg-green-100 text-green-800 border border-green-200'
                                                    }`}>
                                                        {item.cancelled ? 'Cancelled' : 'Active'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-gray-600 text-xs mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>{slotDateFormat(item.slotDate)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>{item.slotTime}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="flex items-center gap-3">
                                            {!item.cancelled && (
                                                <button
                                                    onClick={() => adminCancelAppointment(item._id)}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200"
                                                    title="Cancel Appointment"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📅</div>
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Appointments</h3>
                                <p className="text-gray-500">No recent appointments found.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {dashData.latestAppointment?.length > 0 && (
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Showing latest {dashData.latestAppointment.length} appointments</span>
                                <button
                                    onClick={getDashData}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default DashBoard;