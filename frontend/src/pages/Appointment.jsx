import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/allAssets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import RelatedDoctors from "../components/relatedDoctors";
import Footer from "../components/footer";

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, getDoctorsData, aToken } = useContext(AppContext);
    const [docInfo, setDocInfo] = useState(null);
    const [docSlot, setDocSlot] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    const fetchDocInfo = () => {
        const docInfo = doctors.find((elm) => elm._id === docId);
        setDocInfo(docInfo);
    };

    const bookAppointment = async () => {
        try {
            if (!aToken) {
                toast.warn("Please login to book an appointment");
                return navigate("/login");
            }
            if (!slotTime) {
                toast.warn("Please select a time slot");
                return;
            }

            setLoading(true);
            const date = docSlot[slotIndex][0].datetime;
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            const slotDate = day + "-" + month + "-" + year;

            const { data } = await axios.post(
                "https://arhospital.onrender.com/api/user/book-appointment",
                { docId, slotDate, slotTime },
                { headers: { token: aToken } }
            );

            if (data.success) {
                toast.success("Appointment booked successfully!");
                getDoctorsData();
                navigate("/myAppointments");
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to book appointment");
        } finally {
            setLoading(false);
        }
    };

    const availableSlots = () => {
        if (!docInfo || !docInfo.slots_booked) return;

        const today = new Date();
        const slots = [];

        for (let r = 0; r < 7; r++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + r);

            let endTime = new Date(currentDate);
            endTime.setHours(21, 0, 0, 0);

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = [];
            while (currentDate < endTime) {
                let formatDate = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                let day = currentDate.getDate();
                let month = currentDate.getMonth() + 1;
                let year = currentDate.getFullYear();
                let slotDate = day + "-" + month + "-" + year;
                let slotTime = formatDate;

                const isAvailableSlot = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;

                if (isAvailableSlot) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formatDate
                    });
                }
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }
            slots.push(timeSlots);
        }
        setDocSlot(slots);
    };

    useEffect(() => {
        fetchDocInfo();
    }, [doctors, docId]);

    useEffect(() => {
        if (docInfo) {
            availableSlots();
        }
    }, [docInfo]);

    if (!docInfo) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Doctors
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Doctor Info Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
                            {/* Doctor Image */}
                            <div className="text-center mb-6">
                                <img 
                                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-100"
                                    src={docInfo.image} 
                                    alt={docInfo.name}
                                />
                            </div>

                            {/* Doctor Details */}
                            <div className="text-center mb-6">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <h2 className="text-2xl font-bold text-gray-900">{docInfo.name}</h2>
                                    <img className="w-5 h-5" src={assets.verified_icon} alt="Verified" />
                                </div>
                                <p className="text-blue-600 font-semibold mb-2">{docInfo.degree} - {docInfo.speciality}</p>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {docInfo.experience} years experience
                                </span>
                            </div>

                            {/* Appointment Fee */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Appointment Fee</span>
                                    <span className="text-2xl font-bold text-gray-900">₹{docInfo.fees}</span>
                                </div>
                            </div>

                            {/* About Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    About Doctor
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm">{docInfo.about}</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Time Slot</h2>

                            {/* Date Selection */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
                                <div className="flex gap-3 overflow-x-auto pb-4">
                                    {docSlot.map((item, index) => (
                                        item.length > 0 && index < 7 && (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setSlotIndex(index);
                                                    setSlotTime('');
                                                }}
                                                className={`flex flex-col items-center justify-center min-w-20 py-4 rounded-xl border-2 transition-all duration-200 flex-shrink-0 ${
                                                    slotIndex === index
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                }`}
                                            >
                                                <span className="text-sm font-medium mb-1">
                                                    {item[0] && dayOfWeek[item[0].datetime.getDay()]}
                                                </span>
                                                <span className="text-lg font-bold">
                                                    {item[0] && item[0].datetime.getDate()}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-1">
                                                    {item[0] && months[item[0].datetime.getMonth()]}
                                                </span>
                                            </button>
                                        )
                                    ))}
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Available Time Slots
                                    {docSlot[slotIndex] && (
                                        <span className="text-sm font-normal text-gray-600 ml-2">
                                            ({docSlot[slotIndex].length} slots available)
                                        </span>
                                    )}
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {docSlot[slotIndex]?.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSlotTime(item.time)}
                                            className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 font-medium ${
                                                item.time === slotTime
                                                    ? 'border-blue-500 bg-blue-500 text-white shadow-sm'
                                                    : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                        >
                                            {item.time.toLowerCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Book Button */}
                            <div className="border-t border-gray-200 pt-6">
                                <button
                                    onClick={bookAppointment}
                                    disabled={loading || !slotTime}
                                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                                        loading || !slotTime
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                    }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Booking Appointment...
                                        </div>
                                    ) : (
                                        `Book Appointment - ₹${docInfo.fees}`
                                    )}
                                </button>
                                
                                {slotTime && (
                                    <p className="text-center text-gray-600 mt-4">
                                        Your appointment is scheduled for {dayOfWeek[docSlot[slotIndex]?.[0]?.datetime.getDay()]}, 
                                        {docSlot[slotIndex]?.[0]?.datetime.getDate()} {months[docSlot[slotIndex]?.[0]?.datetime.getMonth()]} at {slotTime.toLowerCase()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

           <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
            <Footer />
        </div>
       
         
            
    );
};

export default Appointment;