import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/adminContext";
import { AppContext } from "../../context/appContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
    const { aToken, appointments, getAllAppointment, adminCancelAppointment } = useContext(AdminContext);
    const { calculateAge, slotDateFormat } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, active, completed, cancelled

    useEffect(() => {
        if (aToken) {
            setLoading(true);
            getAllAppointment().finally(() => setLoading(false));
        }
    }, [aToken]);

    // Filter appointments based on status
    const filteredAppointments = appointments.filter(item => {
        switch (filter) {
            case "active":
                return !item.cancelled && !item.isComplete;
            case "completed":
                return item.isComplete;
            case "cancelled":
                return item.cancelled;
            default:
                return true;
        }
    });

    const getStatusBadge = (item) => {
        if (item.cancelled) {
            return "bg-red-100 text-red-800 border-red-200";
        } else if (item.isComplete) {
            return "bg-green-100 text-green-800 border-green-200";
        } else {
            return "bg-blue-100 text-blue-800 border-blue-200";
        }
    };

    const getStatusText = (item) => {
        if (item.cancelled) {
            return "Cancelled";
        } else if (item.isComplete) {
            return "Completed";
        } else {
            return "Active";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading appointments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">All Appointments</h1>
                    <p className="text-gray-600 mt-2">Manage and monitor all hospital appointments</p>
                </div>

                {/* Stats and Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { key: "all", label: "All Appointments", count: appointments.length },
                                    { key: "active", label: "Active", count: appointments.filter(a => !a.cancelled && !a.isComplete).length },
                                    { key: "completed", label: "Completed", count: appointments.filter(a => a.isComplete).length },
                                    { key: "cancelled", label: "Cancelled", count: appointments.filter(a => a.cancelled).length }
                                ].map((filterOption) => (
                                    <button
                                        key={filterOption.key}
                                        onClick={() => setFilter(filterOption.key)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            filter === filterOption.key
                                                ? "bg-blue-600 text-white shadow-md"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {filterOption.label} ({filterOption.count})
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                            Showing {filteredAppointments.length} of {appointments.length} appointments
                        </div>
                    </div>
                </div>

                {/* Appointments Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                    {/* Table Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                        <div className="hidden sm:grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                            <div className="col-span-1">#</div>
                            <div className="col-span-3">Patient</div>
                            <div className="col-span-1">Age</div>
                            <div className="col-span-2">Date & Time</div>
                            <div className="col-span-3">Doctor</div>
                            <div className="col-span-1">Fees</div>
                            <div className="col-span-1">Status</div>
                        </div>
                        <div className="sm:hidden text-sm font-semibold text-gray-700">
                            Appointments List ({filteredAppointments.length})
                        </div>
                    </div>

                    {/* Appointments List */}
                    <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
                        {filteredAppointments.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📅</div>
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Appointments Found</h3>
                                <p className="text-gray-500">
                                    {filter === "all" 
                                        ? "There are no appointments in the system."
                                        : `No ${filter} appointments found.`
                                    }
                                </p>
                            </div>
                        ) : (
                            filteredAppointments.map((item, index) => (
                                <div key={item._id} className="px-6 py-4 hover:bg-blue-50 transition-colors duration-200">
                                    {/* Desktop View */}
                                    <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
                                        <div className="col-span-1">
                                            <span className="text-gray-500 text-sm">{index + 1}</span>
                                        </div>
                                        
                                        {/* Patient Info */}
                                        <div className="col-span-3">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" 
                                                    src={item.userData.image} 
                                                    alt={item.userData.name}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/40?text=P';
                                                    }}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-semibold text-gray-800 text-sm truncate">
                                                        {item.userData.name}
                                                    </h4>
                                                    <p className="text-gray-500 text-xs truncate">
                                                        {item.userData.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Age */}
                                        <div className="col-span-1">
                                            <span className="text-gray-600 text-sm">
                                                {calculateAge(item.userData.dob)}
                                            </span>
                                        </div>

                                        {/* Date & Time */}
                                        <div className="col-span-2">
                                            <div className="text-gray-800 text-sm font-medium">
                                                {slotDateFormat(item.slotDate)}
                                            </div>
                                            <div className="text-gray-600 text-xs flex items-center gap-1 mt-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {item.slotTime}
                                            </div>
                                        </div>

                                        {/* Doctor Info */}
                                        <div className="col-span-3">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    className="w-8 h-8 rounded-full object-cover border border-gray-200" 
                                                    src={item.docData.image} 
                                                    alt={item.docData.name}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/32?text=DR';
                                                    }}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-gray-800 text-sm truncate">
                                                        Dr. {item.docData.name}
                                                    </p>
                                                    <p className="text-gray-500 text-xs truncate">
                                                        {item.docData.speciality}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Fees */}
                                        <div className="col-span-1">
                                            <span className="text-green-600 font-semibold text-sm">
                                                ₹{item.amount}
                                            </span>
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="col-span-1">
                                            <div className="flex items-center justify-between">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(item)}`}>
                                                    {getStatusText(item)}
                                                </span>
                                                
                                                {!item.cancelled && !item.isComplete && (
                                                    <button
                                                        onClick={() => adminCancelAppointment(item._id)}
                                                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200 ml-2"
                                                        title="Cancel Appointment"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile View */}
                                    <div className="sm:hidden space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" 
                                                    src={item.userData.image} 
                                                    alt={item.userData.name}
                                                />
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{item.userData.name}</h4>
                                                    <p className="text-gray-500 text-sm">Age: {calculateAge(item.userData.dob)}</p>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(item)}`}>
                                                {getStatusText(item)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Doctor:</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <img 
                                                        className="w-6 h-6 rounded-full" 
                                                        src={item.docData.image} 
                                                        alt={item.docData.name}
                                                    />
                                                    <span>Dr. {item.docData.name}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-medium">Fees:</span>
                                                <p className="text-green-600 font-semibold">₹{item.amount}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="font-medium">Date & Time:</span>
                                                <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                                            </div>
                                        </div>

                                        {!item.cancelled && !item.isComplete && (
                                            <div className="flex justify-end pt-2 border-t border-gray-200">
                                                <button
                                                    onClick={() => adminCancelAppointment(item._id)}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Cancel Appointment
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {filteredAppointments.length > 0 && (
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                                <span>
                                    Showing {filteredAppointments.length} appointments
                                    {filter !== "all" && ` (${filter} only)`}
                                </span>
                                <button
                                    onClick={getAllAppointment}
                                    className="text-blue-600 hover:text-blue-800 font-medium mt-2 sm:mt-0 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Refresh List
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllAppointments;