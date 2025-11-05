import React from 'react';
import { speciality } from "../assets/allAssets.js";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
    const handleSpecialityClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className="py-20  px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Find by Medical Speciality
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Connect with specialized healthcare professionals tailored to your specific medical needs
                    </p>
                </div>

                {/* Specialities Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 lg:gap-8">
                    {speciality.map((speciality, index) => (
                        <Link
                            key={index}
                            to={`/doctors/${speciality.speciality}`}
                            onClick={handleSpecialityClick}
                            className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden text-center"
                        >
                            {/* Hover Effect Background */}
                            <div className="absolute inset-1 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                            
                            {/* Icon Container */}
                            <div className="relative mb-4">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                    <img 
                                        className="w-12 h-12 object-contain" 
                                        src={speciality.image} 
                                        alt={speciality.speciality}
                                    />
                                </div>
                                {/* Hover Animation Ring */}
                                <div className="absolute inset-0 border-2 border-blue-200 rounded-2xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></div>
                            </div>

                            {/* Speciality Name */}
                            <h3 className="font-semibold text-gray-900 text-[10px]  lg:text-sm  group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                                {speciality.speciality}
                            </h3>

                            {/* Hover Arrow Indicator */}
                            
                        </Link>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <div className="text-left">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Can't find your speciality?
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Contact us for personalized assistance in finding the right specialist
                            </p>
                        </div>
                        <Link 
                            to="/doctors"
                            onClick={handleSpecialityClick}
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
                        >
                            View All Doctors
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};



export default SpecialityMenu;