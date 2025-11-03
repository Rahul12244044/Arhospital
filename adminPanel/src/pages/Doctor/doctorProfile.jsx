import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/doctorContext";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorProfile = () => {
    const { profileData, doctorProfile, dToken, setProfileData } = useContext(DoctorContext);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    console.log("profile data: ");
    console.log(profileData);

    const updateProfile = async () => {
        if (!profileData.fees || profileData.fees <= 0) {
            toast.error("Please enter a valid appointment fee");
            return;
        }

        if (!profileData.address.line1.trim()) {
            toast.error("Please enter your address");
            return;
        }

        setIsSubmitting(true);
        try {
            const updateData = {
                address: profileData.address,
                fees: parseInt(profileData.fees),
                available: profileData.available
            }
            const { data } = await axios.post("https://arhospital.onrender.com/api/doctor/update-profile", { updateData }, { headers: { dToken } });
            if (data.success) {
                toast.success("Profile updated successfully!");
                setIsEdit(false);
                doctorProfile();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        if (dToken) {
            setLoading(true);
            doctorProfile().finally(() => setLoading(false));
        }
    }, [dToken]);

    

    if (!profileData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
                    <h2 className="text-xl font-semibold text-gray-600 mb-2">Profile Not Found</h2>
                    <p className="text-gray-500">Unable to load doctor profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Doctor Profile</h1>
                    <p className="text-gray-600 mt-2">Manage your professional information and availability</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-white">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative">
                                <img 
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white border-opacity-20 shadow-lg" 
                                    src={profileData.image} 
                                    alt={profileData.name}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/128?text=DR';
                                    }}
                                />
                                <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white ${
                                    profileData.available ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                            </div>
                            <div className="text-center sm:text-left flex-1">
    <h2 className="text-2xl sm:text-3xl font-bold text-white">{profileData.name}</h2>
    <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
        <span className="bg-white bg-opacity-30 text-black border border-white border-opacity-40 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            {profileData.degree}
        </span>
        <span className="bg-white bg-opacity-30 text-black border border-white border-opacity-40 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            {profileData.speciality}
        </span>
        <span className="bg-white bg-opacity-30 text-black border border-white border-opacity-40 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            {profileData.experience} experience
        </span>
    </div>
</div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="p-6">
                        {/* About Section */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                About
                            </h3>
                            <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                                {profileData.about}
                            </p>
                        </div>

                        {/* Professional Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Appointment Fees */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Appointment Fees
                                </label>
                                {isEdit ? (
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            onChange={(e) => setProfileData((prev) => ({ ...prev, fees: e.target.value }))}
                                            value={profileData.fees}
                                            className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Enter fees"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-2xl font-bold text-gray-800">₹{profileData.fees}</p>
                                )}
                            </div>

                            {/* Availability */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Availability Status
                                </label>
                                <div className="flex items-center gap-3">
                                    {isEdit ? (
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                onChange={() => setProfileData((prev) => ({ ...prev, available: !prev.available }))}
                                                checked={profileData.available}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                {profileData.available ? 'Available' : 'Not Available'}
                                            </span>
                                        </label>
                                    ) : (
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            profileData.available 
                                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                                : 'bg-red-100 text-red-800 border border-red-200'
                                        }`}>
                                            {profileData.available ? 'Available for Appointments' : 'Not Available'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Clinic Address
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                                {isEdit ? (
                                    <>
                                        <input
                                            type="text"
                                            onChange={(e) => setProfileData((prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                            value={profileData.address.line1}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Address Line 1"
                                        />
                                        <input
                                            type="text"
                                            onChange={(e) => setProfileData((prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                            value={profileData.address.line2}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Address Line 2 (Optional)"
                                        />
                                    </>
                                ) : (
                                    <div className="text-gray-600">
                                        <p className="font-medium">{profileData.address.line1}</p>
                                        {profileData.address.line2 && (
                                            <p className="mt-1">{profileData.address.line2}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>{profileData.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
                            {isEdit ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setIsEdit(false);
                                            doctorProfile(); // Reset to original data
                                        }}
                                        disabled={isSubmitting}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={updateProfile}
                                        disabled={isSubmitting}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEdit(true)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorProfile;