import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ docId, speciality }) => {
    const { doctors } = useContext(AppContext);
    const [relDoctors, setRelDoctors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const filtered = doctors.filter((elm) => {
                return elm.speciality === speciality && elm._id !== docId;
            });
            setRelDoctors(filtered.slice(0, 4)); // Show max 4 related doctors
        }
    }, [doctors, docId, speciality]);

    const handleDoctorClick = (doctorId) => {
        navigate(`/appointment/${doctorId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewAll = () => {
        navigate("/doctors");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (relDoctors.length === 0) {
        return null; // Don't render if no related doctors
    }

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Other {speciality} Specialists
                    </h2>
                   
                </div>

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {relDoctors.map((doctor, index) => (
                        <div 
                            key={doctor._id}
                            onClick={() => handleDoctorClick(doctor._id)}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
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

                {/* View All Button */}
               
            </div>
        </section>
    );
};

export default RelatedDoctors;