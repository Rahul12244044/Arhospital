import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Footer from "../components/footer";

const Doctors = () => {
    const { speciality } = useParams();
    const { doctors } = useContext(AppContext);
    const [docFilter, setDocFilter] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const specialities = [
        { name: "General Physician", value: "General physician" },
        { name: "Gynecologist", value: "Gynecologist" },
        { name: "Dermatologist", value: "Dermatologist" },
        { name: "Pediatrician", value: "Pediatricians" },
        { name: "Neurologist", value: "Neurologist" },
        { name: "Gastroenterologist", value: "Gastroenterologist" }
    ];

    const applyFilter = () => {
        let filtered = doctors;

        // Filter by speciality
        if (speciality) {
            filtered = filtered.filter(doctor => 
                doctor.speciality.toLowerCase() === speciality.toLowerCase()
            );
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(doctor =>
                doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setDocFilter(filtered);
    };

    useEffect(() => {
        applyFilter();
    }, [doctors, speciality, searchTerm]);

    const handleSpecialityClick = (specValue) => {
        if (speciality === specValue) {
            navigate("/doctors");
        } else {
            navigate(`/doctors/${specValue}`);
        }
        setShowFilters(false);
    };

    const getAvailabilityColor = (available) => {
        return available ? "text-green-600" : "text-red-600";
    };

    const getAvailabilityBgColor = (available) => {
        return available ? "bg-green-500" : "bg-red-500";
    };

    return (
        <div className="min-h-screen">
            {/* Header Section */}
            

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filter Bar */}
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    {/* Search Input */}
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search doctors by name or speciality..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                            <svg 
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Filter Toggle Button for Mobile */}
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                        </svg>
                        Filters
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className={`lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Specialities</h3>
                                {speciality && (
                                    <button 
                                        onClick={() => navigate("/doctors")}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            
                            <div className="space-y-3">
                                {specialities.map((spec, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSpecialityClick(spec.value)}
                                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                                            speciality === spec.value
                                                ? "bg-blue-50 border-blue-200 text-blue-700 font-medium shadow-sm"
                                                : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                                        }`}
                                    >
                                        {spec.name}
                                    </button>
                                ))}
                            </div>

                            {/* Results Count */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Showing <span className="font-semibold text-gray-900">{docFilter.length}</span> doctors
                                    {speciality && (
                                        <span> in <span className="font-semibold text-gray-900">{speciality}</span></span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Doctors Grid */}
                    <div className="flex-1">
                        {docFilter.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm 
                                        ? `No doctors match your search for "${searchTerm}"`
                                        : "No doctors available in this speciality"
                                    }
                                </p>
                                {(searchTerm || speciality) && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            navigate("/doctors");
                                        }}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        View All Doctors
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Mobile Results Info */}
                                <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold text-gray-900">{docFilter.length}</span> doctors found
                                        {speciality && (
                                            <span> in <span className="font-semibold text-gray-900">{speciality}</span></span>
                                        )}
                                    </p>
                                </div>

                                {/* Doctors Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {docFilter.map((doctor, index) => (
                                        <div 
                                            key={doctor._id}
                                            onClick={() => navigate(`/appointment/${doctor._id}`)}
                                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                                        >
                                            {/* Doctor Image */}
                                            <div className="relative overflow-hidden">
                                                <img 
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                                                    {doctor.available ? 'Available' : 'Not Available'}
                                                </div>
                                            </div>

                                            {/* Doctor Info */}
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                            {doctor.name}
                                                        </h3>
                                                        <p className="text-blue-600 font-medium">
                                                            {doctor.speciality}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Availability Status */}
                                               

                                                {/* CTA Button */}
                                                
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Doctors;