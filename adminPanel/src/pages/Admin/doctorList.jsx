import React, { useEffect, useContext, useState } from "react";
import { AdminContext } from "../../context/adminContext";

const DoctorList = () => {
    const { aToken, doctors, getAllDoctors, changeAvailability } = useContext(AdminContext);
    const [loading, setLoading] = useState(true);

    console.log("aToken in the DoctorList: ");
    console.log(aToken);

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            await getAllDoctors();
            setLoading(false);
        };
        fetchDoctors();
    }, [aToken]);

    const handleAvailabilityChange = async (doctorId, currentStatus) => {
        try {
            await changeAvailability(doctorId);
        } catch (error) {
            console.error("Error updating availability:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Medical Staff</h1>
                    <p className="text-gray-600 mt-2">Manage doctor availability and profiles</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                        <p className="text-2xl font-bold text-gray-900">{doctors.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                        <p className="text-sm font-medium text-gray-600">Available</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {doctors.filter(doc => doc.available).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
                        <p className="text-sm font-medium text-gray-600">Unavailable</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {doctors.filter(doc => !doc.available).length}
                        </p>
                    </div>
                </div>

                {/* Doctors Grid */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Doctor Directory</h2>
                    </div>
                    
                    <div className="p-6">
                        {doctors.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
                                <p className="text-gray-600">Get started by adding doctors to the system.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {doctors.map((doctor, index) => (
                                    <div 
                                        key={doctor._id} 
                                        className="bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group"
                                    >
                                        {/* Doctor Image */}
                                        <div className="relative overflow-hidden">
                                            <img 
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                                                src={doctor.image || "/api/placeholder/300/200"} 
                                                alt={doctor.name}
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=6366f1&color=fff&size=300`;
                                                }}
                                            />
                                            <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                                                doctor.available 
                                                    ? 'bg-green-100 text-green-800 border border-green-200' 
                                                    : 'bg-red-100 text-red-800 border border-red-200'
                                            }`}>
                                                {doctor.available ? 'Available' : 'Unavailable'}
                                            </div>
                                        </div>

                                        {/* Doctor Info */}
                                        <div className="p-4">
                                            <div className="mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                    {doctor.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {doctor.speciality}
                                                </p>
                                            </div>

                                            {/* Availability Toggle */}
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                                <span className="text-sm text-gray-600">Status</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer"
                                                        checked={doctor.available}
                                                        onChange={() => handleAvailabilityChange(doctor._id, doctor.available)}
                                                    />
                                                    <div className={`w-11 h-6 rounded-full peer ${
                                                        doctor.available 
                                                            ? 'bg-green-500 peer-checked:bg-green-600' 
                                                            : 'bg-gray-300 peer-checked:bg-gray-400'
                                                    } peer-focus:ring-2 peer-focus:ring-green-300 transition-colors duration-200`}>
                                                        <div className={`absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ${
                                                            doctor.available ? 'transform translate-x-5' : ''
                                                        }`}></div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorList;