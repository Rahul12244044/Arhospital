import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/doctorContext";
import { AppContext } from "../../context/appContext";
import { assets } from "../../assets/assets";

const DoctorAppointment = () => {
    const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);
    const { calculateAge, slotDateFormat } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, upcoming, completed, cancelled

    useEffect(() => {
        if (dToken) {
            setLoading(true);
            getAppointments().finally(() => setLoading(false));
        }
    }, [dToken]);
    console.log("appointments: ");
    console.log(appointments);

    // Filter appointments based on status
    // Filter appointments based on status
const filteredAppointments = appointments.filter(item => {
    switch (filter) {
        case "upcoming":
            return !item.cancelled && !item.isCompleted;
        case "completed":
            return item.isCompleted && !item.cancelled; // Ensure completed appointments aren't cancelled
        case "cancelled":
            return item.cancelled; // Only check cancelled field
        default:
            return true;
    }
}).reverse();

    const getStatusBadge = (item) => {
        if (item.cancelled) {
            return "bg-red-100 text-red-800 border-red-200";
        } else if (item.isCompleted) {
            return "bg-green-100 text-green-800 border-green-200";
        } else {
            return "bg-blue-100 text-blue-800 border-blue-200";
        }
    };

    const getStatusText = (item) => {
        if (item.cancelled) {
            return "Cancelled";
        } else if (item.isCompleted) {
            return "Completed";
        } else {
            return "Upcoming";
        }
    };

    

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
                    <p className="text-gray-600 mt-2">Manage your patient appointments</p>
                </div>

                {/* Stats and Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">Filter by:</span>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { key: "all", label: "All Appointments", count: appointments.length },
                                    { key: "upcoming", label: "Upcoming", count: appointments.filter(a => !a.cancelled && !a.isCompleted).length },
                                    { key: "completed", label: "Completed", count: appointments.filter(a => a.isCompleted).length },
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
                        <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                            <div className="col-span-12 sm:col-span-5 lg:col-span-4">Patient</div>
                            <div className="hidden sm:block sm:col-span-2 lg:col-span-2">Age</div>
                            <div className="hidden lg:block lg:col-span-3">Date & Time</div>
                            <div className="hidden sm:block sm:col-span-2 lg:col-span-1">Amount</div>
                            <div className="col-span-12 sm:col-span-3 lg:col-span-2 text-right">Status & Actions</div>
                        </div>
                    </div>

                    {/* Appointments List */}
                    <div className="divide-y divide-gray-100">
                        {filteredAppointments.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📅</div>
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Appointments</h3>
                                <p className="text-gray-500">
                                    {filter === "all" 
                                        ? "You don't have any appointments yet."
                                        : `No ${filter} appointments found.`
                                    }
                                </p>
                            </div>
                        ) : (
                            filteredAppointments.map((item, index) => (
                                <div key={item._id} className="px-6 py-4 hover:bg-blue-50 transition-colors duration-200">
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        {/* Patient Info */}
                                        <div className="col-span-12 sm:col-span-5 lg:col-span-4">
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
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                            item.payment 
                                                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                                                : "bg-orange-100 text-orange-800 border border-orange-200"
                                                        }`}>
                                                            {item.payment ? "Online" : "Cash"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Age - Hidden on mobile */}
                                        <div className="hidden sm:block sm:col-span-2 lg:col-span-2">
                                            <div className="text-gray-600 text-sm">
                                                {calculateAge(item.userData.dob)} years
                                            </div>
                                        </div>

                                        {/* Date & Time - Hidden on mobile */}
                                        <div className="hidden lg:block lg:col-span-3">
                                            <div className="text-gray-800 text-sm font-medium">
                                                {slotDateFormat(item.slotDate)}
                                            </div>
                                            <div className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {item.slotTime}
                                            </div>
                                        </div>

                                        {/* Amount - Hidden on mobile */}
                                        <div className="hidden sm:block sm:col-span-2 lg:col-span-1">
                                            <div className="text-green-600 font-semibold text-sm">
                                                ₹{item.amount}
                                            </div>
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="col-span-12 sm:col-span-3 lg:col-span-2">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                                                {/* Status Badge */}
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(item)}`}>
                                                    {getStatusText(item)}
                                                </span>

                                                {/* Actions */}
                                                {!item.cancelled && !item.isCompleted && (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => cancelAppointment(item._id)}
                                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200"
                                                            title="Cancel Appointment"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => completeAppointment(item._id)}
                                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200 border border-green-200"
                                                            title="Complete Appointment"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Mobile View Details */}
                                            <div className="sm:hidden mt-3 pt-3 border-t border-gray-200">
                                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <span className="font-medium">Age:</span> {calculateAge(item.userData.dob)} years
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Time:</span> {item.slotTime}
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="font-medium">Date:</span> {slotDateFormat(item.slotDate)}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Amount:</span> ₹{item.amount}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                                    onClick={getAppointments}
                                    className="text-blue-600 hover:text-blue-800 font-medium mt-2 sm:mt-0"
                                >
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

export default DoctorAppointment;