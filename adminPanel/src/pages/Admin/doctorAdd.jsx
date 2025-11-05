import React, { useState, useContext } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/adminContext";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorAdd = () => {
    const [docImg, setDocImg] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [experience, setExperience] = useState("1 Year");
    const [fees, setFee] = useState("");
    const [about, setAbout] = useState("");
    const [speciality, setSpeciality] = useState("General physician");
    const [degree, setDegree] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [loading, setLoading] = useState(false);
    const { backendUrl, aToken } = useContext(AdminContext);

    const onSubmitForm = async (e) => {
        e.preventDefault();
        if (!docImg) {
            return toast.error("Please upload doctor's photo");
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("image", docImg);
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("experience", experience);
            formData.append("speciality", speciality);
            formData.append("degree", degree);
            formData.append("address", JSON.stringify({ line1: address1, line2: address2 }));
            formData.append("fees", fees);
            formData.append("about", about);

            const { data } = await axios.post("https://arhospital.onrender.com/api/admin/add-doctor", formData, { headers: { aToken } });
            
            if (data.success) {
                toast.success("Doctor added successfully!");
                // Reset form
                setDocImg(false);
                setName("");
                setEmail("");
                setPassword("");
                setAddress1("");
                setAddress2("");
                setAbout("");
                setFee("");
                setDegree("");
                setExperience("1 Year");
                setSpeciality("General physician");
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add doctor");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Add New Doctor</h1>
                    <p className="text-gray-600 mt-2">Register a new healthcare professional to the system</p>
                </div>

                <form onSubmit={onSubmitForm} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white">Doctor Information</h2>
                        <p className="text-blue-100 text-sm mt-1">Fill in the details to register a new doctor</p>
                    </div>

                    <div className="p-6 max-h-[80vh] overflow-y-auto">
                        {/* Profile Image Upload */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative group">
                                <label htmlFor="doc-img" className="cursor-pointer">
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden group-hover:shadow-xl transition-all duration-300">
                                        <img 
                                            className="w-full h-full object-cover"
                                            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} 
                                            alt="Doctor profile"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </label>
                                <input 
                                    onChange={(e) => setDocImg(e.target.files[0])} 
                                    type="file" 
                                    id="doc-img" 
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            <p className="text-gray-600 text-sm mt-3 text-center">
                                Click to upload doctor's profile picture<br/>
                                <span className="text-gray-400">Recommended: Square image, max 2MB</span>
                            </p>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        type="text"
                                        placeholder="Dr. John Doe"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        type="email"
                                        placeholder="doctor@hospital.com"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                {/* Experience */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Experience
                                    </label>
                                    <select
                                        onChange={(e) => setExperience(e.target.value)}
                                        value={experience}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        {[...Array(15)].map((_, i) => (
                                            <option key={i + 1} value={`${i + 1} Year${i > 0 ? 's' : ''}`}>
                                                {i + 1} Year{i > 0 ? 's' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Fees */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Consultation Fees (₹) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500">₹</span>
                                        </div>
                                        <input
                                            onChange={(e) => setFee(e.target.value)}
                                            value={fees}
                                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            type="number"
                                            placeholder="500"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                {/* Speciality */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Speciality <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        onChange={(e) => setSpeciality(e.target.value)}
                                        value={speciality}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="General physician">General Physician</option>
                                        <option value="Gynecologist">Gynecologist</option>
                                        <option value="Dermatologist">Dermatologist</option>
                                        <option value="Pediatricians">Pediatrician</option>
                                        <option value="Neurologist">Neurologist</option>
                                        <option value="Gastroenterologist">Gastroenterologist</option>
                                        <option value="Cardiologist">Cardiologist</option>
                                        <option value="Orthopedic">Orthopedic</option>
                                        <option value="Psychiatrist">Psychiatrist</option>
                                    </select>
                                </div>

                                {/* Education */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Education & Degree <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        onChange={(e) => setDegree(e.target.value)}
                                        value={degree}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        type="text"
                                        placeholder="MBBS, MD, etc."
                                        required
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Clinic Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        onChange={(e) => setAddress1(e.target.value)}
                                        value={address1}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors mb-2"
                                        type="text"
                                        placeholder="Street address, building number"
                                        required
                                    />
                                    <input
                                        onChange={(e) => setAddress2(e.target.value)}
                                        value={address2}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        type="text"
                                        placeholder="Area, city, PIN code"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* About Doctor */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                About Doctor <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                onChange={(e) => setAbout(e.target.value)}
                                value={about}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                rows={4}
                                placeholder="Describe the doctor's expertise, achievements, and approach to patient care..."
                                required
                            />
                            <p className="text-gray-500 text-xs mt-1">Brief professional biography (min. 50 characters)</p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white px-12 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Adding Doctor...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Doctor to System
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorAdd;