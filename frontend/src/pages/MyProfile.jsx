import React, { useState, useContext } from 'react';
import { assets } from "../assets/allAssets";
import Footer from "../components/footer";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
    const { userData, setUserData, aToken, loadUserData } = useContext(AppContext);
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(false);

    const updateUserProfileData = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("name", userData.name);
            formData.append("phone", userData.phone);
            formData.append("address", JSON.stringify(userData.address));
            formData.append("gender", userData.gender);
            formData.append("dob", userData.dob);
            image && formData.append("image", image);
            
            const { data } = await axios.post("http://localhost:4000/api/user/update-profile", formData, { headers: { token: aToken } });
            
            if (data.success) {
                toast.success("Profile updated successfully!");
                loadUserData();
                setIsEdit(false);
                setImage(false);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!userData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {/* Profile Image */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                                    <img 
                                        className="w-full h-full object-cover"
                                        src={image ? URL.createObjectURL(image) : userData.image} 
                                        alt={userData.name}
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6366f1&color=fff&size=256`;
                                        }}
                                    />
                                </div>
                                {isEdit && (
                                    <label htmlFor="image" className="absolute bottom-2 right-2 cursor-pointer">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors duration-200">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <input 
                                            onChange={(e) => setImage(e.target.files[0])} 
                                            type="file" 
                                            id="image" 
                                            accept="image/*"
                                            className="hidden" 
                                        />
                                    </label>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="text-center sm:text-left flex-1">
                                {isEdit ? (
                                    <input 
                                        className="text-3xl font-bold text-white bg-transparent border-b-2 border-white/30 focus:border-white focus:outline-none text-center sm:text-left"
                                        type="text" 
                                        value={userData.name} 
                                        onChange={(event) => setUserData((prev) => ({ ...prev, name: event.target.value }))}
                                    />
                                ) : (
                                    <h2 className="text-3xl font-bold text-white">{userData.name}</h2>
                                )}
                                <p className="text-blue-100 mt-2 text-lg">{userData.email}</p>
                                <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                                    <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                                        {userData.gender}
                                    </span>
                                    <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                                        Member since {new Date().getFullYear()}
                                    </span>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <div className="flex gap-3">
                                {isEdit ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setIsEdit(false);
                                                setImage(false);
                                                loadUserData(); // Reset changes
                                            }}
                                            className="px-6 py-2 border border-white text-white rounded-lg hover:bg-white/10 transition-colors duration-200"
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={updateUserProfileData}
                                            disabled={loading}
                                            className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
                                        className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
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

                    {/* Profile Details */}
                    <div className="p-6 lg:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Contact Information */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        Contact Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            {isEdit ? (
                                                <input
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    type="tel"
                                                    value={userData.phone}
                                                    onChange={(event) => setUserData((prev) => ({ ...prev, phone: event.target.value }))}
                                                    placeholder="Enter your phone number"
                                                />
                                            ) : (
                                                <p className="text-gray-900 font-medium">{userData.phone || 'Not provided'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                            {isEdit ? (
                                                <div className="space-y-2">
                                                    <input
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                        type="text"
                                                        value={userData.address.line1}
                                                        onChange={(event) => setUserData((prev) => ({ ...prev, address: { ...prev.address, line1: event.target.value } }))}
                                                        placeholder="Address line 1"
                                                    />
                                                    <input
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                        type="text"
                                                        value={userData.address.line2}
                                                        onChange={(event) => setUserData((prev) => ({ ...prev, address: { ...prev.address, line2: event.target.value } }))}
                                                        placeholder="Address line 2"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="text-gray-900">
                                                    <p className="font-medium">{userData.address.line1}</p>
                                                    {userData.address.line2 && (
                                                        <p className="font-medium">{userData.address.line2}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Basic Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                            {isEdit ? (
                                                <select
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    value={userData.gender}
                                                    onChange={(event) => setUserData((prev) => ({ ...prev, gender: event.target.value }))}
                                                >
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            ) : (
                                                <p className="text-gray-900 font-medium">{userData.gender}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                            {isEdit ? (
                                                <input
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    type="date"
                                                    value={userData.dob}
                                                    onChange={(event) => setUserData((prev) => ({ ...prev, dob: event.target.value }))}
                                                />
                                            ) : (
                                                <p className="text-gray-900 font-medium">{formatDate(userData.dob) || 'Not provided'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default MyProfile;