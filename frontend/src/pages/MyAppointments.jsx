import React, { useContext, useState, useEffect } from 'react';
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { useNavigate } from 'react-router-dom';
import PaymentModal from './PaymentModal';

const MyAppointments = () => {
    const { aToken, getDoctorsData } = useContext(AppContext);
    const [appointments, setAppointments] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const navigate = useNavigate();
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split("-");
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
    }

    const viewAppointmentStatus = (appointment) => {
        navigate('/health-monitor', { state: { appointment } });
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post("http://localhost:4000/api/user/cancel-appointment", { appointmentId }, { headers: { token: aToken } });
            if (data.success) {
                toast.success(data.message);
                getUserAppointments();
                getDoctorsData();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    const handlePaymentClick = (appointment) => {
        setSelectedAppointment(appointment);
        setShowPaymentModal(true);
    }

    const handlePaymentSuccess = async () => {
        toast.success("Payment completed successfully!");
        // Force refresh appointments with a small delay to ensure backend updates
        setTimeout(() => {
            getUserAppointments();
        }, 500);
        setShowPaymentModal(false);
        setSelectedAppointment(null);
    }

    const handlePaymentClose = () => {
        setShowPaymentModal(false);
        setSelectedAppointment(null);
    }

    const getUserAppointments = async () => {
    try {
        console.log('Fetching appointments...');
        const { data } = await axios.get("http://localhost:4000/api/user/appointments", { 
            headers: { token: aToken } 
        });
        if (data.success) {
            console.log('Appointments fetched:', data.allAppointments.map(apt => ({
                id: apt._id,
                paid: apt.paid,
                payment: apt.payment,
                status: apt.status
            })));
            setAppointments(data.allAppointments.reverse());
        }
    } catch (err) {
        console.error('Error fetching appointments:', err);
        toast.error(err.message);
    }
}

    // Add auto-refresh effect to check for updates
    useEffect(() => {
        if (aToken) {
            getUserAppointments();
            
            // Set up interval to refresh appointments every 10 seconds
            const interval = setInterval(() => {
                getUserAppointments();
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [aToken])

    return (
        <div>
            <p className="pb-3 mt-12 font-medium text-zinc-700 border-b border-zinc-200">My appointments</p>
            <div>
                {appointments.map((item, index) => {
                    return (
                        <div key={index} className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b border-zinc-200">
                            <div>
                                <img className="w-32 h-32 object-cover rounded-lg bg-indigo-50" src={item.docData.image} alt="Doctor" />
                            </div>
                            <div className="flex-1 text-sm text-zinc-700">
                                <p className="text-neutral-800 font-semibold text-lg">{item.docData.name}</p>
                                <p className="text-blue-600 font-medium">{item.docData.speciality}</p>
                                <p className="text-neutral-700 font-medium mt-2">Address:</p>
                                <p className="text-sm">{item.docData.address.line1}</p>
                                <p className="text-sm">{item.docData.address.line2}</p>
                                <p className="text-sm mt-2">
                                    <span className="text-neutral-700 font-medium">Date & Time:</span>&nbsp;
                                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                                </p>
                                
                                {/* Status Badge */}
                                <div className="mt-3">
                                    {item.cancelled ? (
                                        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                            Cancelled
                                        </span>
                                    ) : item.isCompleted ? (
                                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                            Completed
                                        </span>
                                    ) : item.paid ? (
                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                            Paid
                                        </span>
                                    ) : (
                                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                            Payment Pending
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 justify-end">
                                {/* Status Button - Always Visible */}
                                <button 
                                    onClick={() => viewAppointmentStatus(item)} 
                                    className="text-sm text-white bg-purple-600 text-center sm:min-w-48 py-2 px-4 border border-purple-600 rounded hover:bg-purple-700 hover:border-purple-700 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <span>View Status</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                
                                {/* Other Action Buttons */}
                                {!item.cancelled && !item.isCompleted && !item.paid && (
                                    <button 
                                        onClick={() => handlePaymentClick(item)} 
                                        className="text-sm text-white bg-green-600 text-center sm:min-w-48 py-2 border border-green-600 rounded hover:bg-green-700 hover:border-green-700 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        Pay Online
                                    </button>
                                )}
                                
                                {!item.cancelled && !item.isCompleted && item.paid && (
                                    <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500 bg-green-50 cursor-not-allowed flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Payment Completed
                                    </button>
                                )}
                                
                                {!item.cancelled && !item.isCompleted && (
                                    <button 
                                        onClick={() => cancelAppointment(item._id)} 
                                        className="text-sm text-white bg-red-600 text-center sm:min-w-48 py-2 border border-red-600 rounded hover:bg-red-700 hover:border-red-700 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                                    >
                                       
                                        Cancel Appointment
                                    </button>
                                )}
                                
                                {item.cancelled && !item.isCompleted && (
                                    <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500 bg-red-50 cursor-not-allowed flex items-center justify-center gap-2">
                                        
                                        Appointment Cancelled
                                    </button>
                                )}
                                
                                {item.isCompleted && (
                                    <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500 bg-green-50 cursor-not-allowed flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Completed
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedAppointment && (
                <PaymentModal 
                    appointment={selectedAppointment}
                    onSuccess={handlePaymentSuccess}
                    onClose={handlePaymentClose}
                    aToken={aToken}
                />
            )}
        </div>
    );
};

export default MyAppointments;