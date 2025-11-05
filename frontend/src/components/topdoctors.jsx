import React, { useContext } from 'react';
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

const TopDoctors = () => {
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);

    const handleDoctorClick = (doctorId) => {
        navigate(`/appointment/${doctorId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewAll = () => {
        navigate("/doctors");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const topDoctors = doctors.slice(0, 8); // Show 8 top doctors for better grid layout

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Our Top Medical Specialists
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Meet our team of highly qualified and experienced healthcare professionals 
                        dedicated to providing exceptional medical care
                    </p>
                </div>

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {topDoctors.map((doctor) => (
                        <div 
                            key={doctor._id}
                            onClick={() => handleDoctorClick(doctor._id)}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                        >
                            {/* Doctor Image */}
                            <div className="relative overflow-hidden h-58">
                                <img 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    src={doctor.image} 
                                    alt={doctor.name}
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=6366f1&color=fff&size=300`;
                                    }}
                                />
                                {/* Availability Badge */}
                                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                                    doctor.available 
                                        ? 'bg-green-100 text-green-800 border border-green-200' 
                                        : 'bg-red-100 text-red-800 border border-red-200'
                                }`}>
                                    {doctor.available ? 'Available' : 'Unavailable'}
                                </div>
                            </div>

                            {/* Doctor Info */}
                            <div className="p-6">
                                <div className="mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                                        {doctor.name}
                                    </h3>
                                    <p className="text-blue-600 font-medium text-sm">
                                        {doctor.speciality}
                                    </p>
                                </div>

                                {/* Availability Status */}
                                

                                {/* CTA Button */}
                               
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
               
                {/* View All Button */}
                <div className="text-center">
                    <button 
                        onClick={handleViewAll}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl border border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                    >
                        <span>View All Doctors</span>
                        <svg 
                            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TopDoctors;