import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const HealthMonitor = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { appointment } = location.state || {};
    const aToken = localStorage.getItem('token') || '';
    
    const [currentAppointment, setCurrentAppointment] = useState(appointment);
    const [currentStatus, setCurrentStatus] = useState(getInitialStatus(appointment));
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Determine initial status based on appointment data
    function getInitialStatus(apt) {
        if (!apt) return 'booked';
        if (apt.cancelled) return 'cancelled';
        if (apt.isCompleted) return 'completed';
        if (apt.medicinePrescribed) return 'medicine';
        if (apt.paid) return 'paid';
        return 'booked';
    }

    // Fetch updated appointment data
    const fetchAppointmentData = async (showToast = false) => {
        if (!currentAppointment?._id || !aToken) return;
        
        try {
            const { data } = await axios.get(
                `https://arhospital.onrender.com/api/user/appointment/${currentAppointment._id}`,
                { headers: { token: aToken } }
            );
            
            if (data.success && data.appointment) {
                setCurrentAppointment(data.appointment);
                setCurrentStatus(getInitialStatus(data.appointment));
                if (showToast) {
                    toast.success('Appointment status updated!');
                }
            }
        } catch (error) {
            console.error('Error fetching appointment:', error);
            if (showToast) {
                toast.error('Failed to fetch appointment details');
            }
        } finally {
            setRefreshing(false);
        }
    };

    // Refresh data when component mounts
    useEffect(() => {
        if (currentAppointment?._id) {
            fetchAppointmentData();
        }
    }, [currentAppointment?._id]);

    // Auto-refresh data every 10 seconds for real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            if (currentAppointment?._id && !['completed', 'cancelled'].includes(currentStatus)) {
                fetchAppointmentData();
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [currentAppointment?._id, currentStatus]);

    // Define the stages based on appointment status
    const getStages = () => {
        // If appointment is cancelled, show different stages
        if (currentStatus === 'cancelled') {
            return [
                { id: 1, name: 'Booked', status: 'completed' },
                { id: 2, name: 'Cancelled', status: 'cancelled' }
            ];
        }

        const baseStages = [
            { id: 1, name: 'Booked', status: 'completed' },
            { id: 2, name: 'Payment', status: 'pending' },
            { id: 3, name: 'Medicine', status: 'pending' },
            { id: 4, name: 'Completed', status: 'pending' }
        ];

        // Update stages based on current status
        return baseStages.map(stage => {
            // Stage 1 - Always completed if we're past booking
            if (stage.id === 1) return { ...stage, status: 'completed' };
            
            // Stage 2 - Payment Status
            if (stage.id === 2) {
                if (['paid', 'medicine', 'completed'].includes(currentStatus)) {
                    return { ...stage, status: 'completed' };
                }
                if (currentStatus === 'booked') {
                    return { ...stage, status: 'current' };
                }
            }
            
            // Stage 3 - Medicine Point
            if (stage.id === 3) {
                if (['medicine', 'completed'].includes(currentStatus)) {
                    return { ...stage, status: 'completed' };
                }
                if (currentStatus === 'paid') {
                    return { ...stage, status: 'current' };
                }
            }
            
            // Stage 4 - Complete Appointment
            if (stage.id === 4) {
                if (currentStatus === 'completed') {
                    return { ...stage, status: 'completed' };
                }
                if (currentStatus === 'medicine') {
                    return { ...stage, status: 'current' };
                }
            }
            
            return stage;
        });
    };

    const stages = getStages();

    const getStageIcon = (stage, index) => {
        switch (stage.status) {
            case 'completed':
                return '✓';
            case 'cancelled':
                return '✗';
            case 'current':
                return '⟳';
            default:
                return index + 1;
        }
    };

    const getStageStyles = (stage) => {
        const baseStyles = "w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-lg border-2 md:border-3 transition-all duration-300 z-20 relative";
        
        switch (stage.status) {
            case 'completed':
                return `${baseStyles} bg-green-500 border-green-500 text-white shadow-lg scale-105`;
            case 'cancelled':
                return `${baseStyles} bg-red-500 border-red-500 text-white`;
            case 'current':
                return `${baseStyles} bg-blue-500 border-blue-500 text-white animate-pulse shadow-lg scale-110`;
            case 'pending':
                return `${baseStyles} bg-white border-gray-300 text-gray-500`;
            default:
                return `${baseStyles} bg-white border-gray-300 text-gray-500`;
        }
    };

    const getConnectorStyles = (stage, index, stages) => {
        if (index === stages.length - 1) return 'hidden';
        
        const baseStyles = "absolute top-4 md:top-6 left-1/2 w-full h-1 md:h-2 z-10 transform -translate-y-1/2";
        
        // For cancelled state, show red line only for the first stage connector
        if (stage.status === 'cancelled' && index === 0) {
            return `${baseStyles} bg-red-500`;
        }
        
        // For completed stages, show green line to the next stage
        if (stage.status === 'completed') {
            return `${baseStyles} bg-green-500`;
        }
        
        // For current stage, show gradient from green to gray
        if (stage.status === 'current') {
            return `${baseStyles} bg-gradient-to-r from-green-500 to-gray-300`;
        }
        
        // For pending stages after completed ones, show green line if previous was completed
        if (index > 0 && stages[index - 1].status === 'completed') {
            return `${baseStyles} bg-green-500`;
        }
        
        return `${baseStyles} bg-gray-300`;
    };

    const getStageDate = (stageId) => {
        if (!currentAppointment) return '';
        
        const now = new Date().toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        
        switch(stageId) {
            case 1:
                return currentAppointment.createdAt ? 
                    new Date(currentAppointment.createdAt).toLocaleDateString() : 
                    currentAppointment.slotDate || now;
            case 2:
                return currentAppointment.paymentDate ? 
                    new Date(currentAppointment.paymentDate).toLocaleDateString() : 
                    (currentAppointment.paid ? 'Completed' : 'Pending');
            case 3:
                return currentAppointment.medicineDate || 'Pending';
            case 4:
                return currentAppointment.completionDate || 'Pending';
            default:
                return '';
        }
    };

    const getStageDescription = (stageId) => {
        switch(stageId) {
            case 1:
                return 'Appointment booked successfully';
            case 2:
                return currentAppointment?.paid ? 
                    `Payment of ₹${currentAppointment.amount || 500} completed` : 
                    'Complete payment to proceed';
            case 3:
                return currentStatus === 'medicine' || currentStatus === 'completed' ?
                    'Medicines prescribed by doctor' :
                    'Doctor will prescribe medicines';
            case 4:
                return currentStatus === 'completed' ?
                    'Appointment completed successfully' :
                    'Final stage after medicine';
            default:
                return '';
        }
    };

    const handleBackToAppointments = () => {
        navigate('/myAppointments');
    };

    if (!currentAppointment) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">No Appointment Selected</h2>
                    <button 
                        onClick={handleBackToAppointments}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
                    >
                        Back to Appointments
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 md:p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-xl md:text-3xl font-bold text-gray-800">Appointment Tracker</h1>
                        <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Track your appointment progress</p>
                    </div>
                    <div className="flex justify-center md:justify-end gap-2">
                        <button 
                            onClick={handleBackToAppointments}
                            className="bg-white text-gray-700 px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                        >
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {refreshing && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-4 w-4 md:h-6 md:w-6 border-b-2 border-blue-600"></div>
                            <p className="text-blue-700 text-sm md:text-base">Updating appointment status...</p>
                        </div>
                    </div>
                )}

                {/* Appointment Info Card */}
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                        <div className="flex items-center gap-3 md:gap-4">
                            <img 
                                src={currentAppointment.docData?.image || '/default-doctor.png'} 
                                alt="Doctor" 
                                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/64?text=DR';
                                }}
                            />
                            <div>
                                <h3 className="font-semibold text-gray-800 text-sm md:text-base">Dr. {currentAppointment.docData?.name || 'Doctor'}</h3>
                                <p className="text-blue-600 text-xs md:text-sm">{currentAppointment.docData?.speciality || 'General Physician'}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs md:text-sm text-gray-500">Appointment ID</p>
                            <p className="font-semibold text-xs md:text-sm">{currentAppointment._id?.slice(-8) || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-xs md:text-sm text-gray-500">Date & Time</p>
                            <p className="font-semibold text-xs md:text-sm">
                                {currentAppointment.slotDate || 'N/A'} 
                                <br className="md:hidden" />
                                {currentAppointment.slotTime || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs md:text-sm text-gray-500">Fee</p>
                            <p className="font-semibold text-green-600 text-sm md:text-base">₹{currentAppointment.amount || 500}</p>
                        </div>
                    </div>
                </div>

                {/* Status Tracker */}
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 pb-4 border-b-2 border-gray-100 gap-3">
                        <h3 className="text-lg md:text-xl font-bold text-gray-800 text-center md:text-left">Appointment Journey</h3>
                        <div className={`px-3 py-1 md:px-4 md:py-2 rounded-lg font-semibold capitalize text-sm md:text-base text-center ${
                            currentStatus === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                            currentStatus === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' :
                            currentStatus === 'medicine' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                            currentStatus === 'paid' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                            Status: {currentStatus.replace('_', ' ')}
                        </div>
                    </div>

                    <div className="relative">
                        {/* Progress Line Container */}
                        <div className="absolute top-4 md:top-6 left-0 w-full h-1 md:h-2 z-10">
                            <div className="flex justify-between items-center w-full h-full">
                                {/* Main progress line background */}
                                <div className="absolute top-0 left-8 md:left-12 right-8 md:right-12 h-full bg-gray-300 rounded-full"></div>
                                
                                {/* Completed progress line */}
                                {currentStatus !== 'cancelled' && (
                                    <div 
                                        className="absolute top-0 left-8 md:left-12 h-full bg-green-500 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${
                                                currentStatus === 'booked' ? '0%' :
                                                currentStatus === 'paid' ? '33%' :
                                                currentStatus === 'medicine' ? '66%' :
                                                currentStatus === 'completed' ? '100%' : '0%'
                                            }`
                                        }}
                                    ></div>
                                )}
                            </div>
                        </div>

                        {/* Stages */}
                        <div className="flex justify-between relative z-20">
                            {stages.map((stage, index) => (
                                <div key={stage.id} className="flex flex-col items-center relative flex-1">
                                    <div className="text-center px-1 md:px-3">
                                        <div className={getStageStyles(stage)}>
                                            {getStageIcon(stage, index)}
                                        </div>
                                        <div className="font-semibold text-xs md:text-sm mt-2 md:mt-3 text-gray-800">
                                            {stage.name}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 hidden md:block">
                                            {getStageDate(stage.id)}
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1 md:mt-2 max-w-xs hidden sm:block">
                                            {getStageDescription(stage.id)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile stage descriptions */}
                    <div className="block sm:hidden space-y-2 mb-4 mt-6">
                        {stages.map((stage, index) => (
                            <div key={stage.id} className="text-center">
                                <div className="text-xs text-gray-600">
                                    <strong>{stage.name}:</strong> {getStageDescription(stage.id)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Current Status Information */}
                    <div className={`rounded-lg p-3 md:p-4 border-l-4 ${
                        currentStatus === 'booked' ? 'bg-yellow-50 border-yellow-400' :
                        currentStatus === 'paid' ? 'bg-blue-50 border-blue-400' :
                        currentStatus === 'medicine' ? 'bg-purple-50 border-purple-400' :
                        currentStatus === 'completed' ? 'bg-green-50 border-green-400' :
                        'bg-red-50 border-red-400'
                    }`}>
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">
                            {currentStatus === 'booked' && '🟡 Payment Required'}
                            {currentStatus === 'paid' && '🔵 Awaiting Consultation'}
                            {currentStatus === 'medicine' && '🟣 Medicines Prescribed'}
                            {currentStatus === 'completed' && '🟢 Appointment Completed'}
                            {currentStatus === 'cancelled' && '🔴 Appointment Cancelled'}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-700">
                            {currentStatus === 'booked' && 'Please complete the payment to confirm your appointment.'}
                            {currentStatus === 'paid' && 'Your payment has been received. Please arrive 15 minutes before your scheduled time.'}
                            {currentStatus === 'medicine' && 'Your consultation is complete. Please collect your prescribed medicines.'}
                            {currentStatus === 'completed' && 'Your appointment has been successfully completed. Thank you!'}
                            {currentStatus === 'cancelled' && 'This appointment has been cancelled. You can book a new appointment if needed.'}
                        </p>
                    </div>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Payment Status Card */}
                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-3 md:mb-4">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                                currentAppointment?.paid ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                            }`}>
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-gray-800 text-sm md:text-base">Payment</h4>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                            {currentAppointment?.paid ? 
                                `Paid: ₹${currentAppointment.amount || 500}` : 
                                'Payment pending'
                            }
                        </p>
                        {!currentAppointment?.paid && !currentAppointment?.cancelled && (
                            <button 
                                onClick={() => navigate('/myAppointments')}
                                className="w-full bg-green-600 text-white py-2 px-3 rounded-lg text-xs md:text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                                Pay Now
                            </button>
                        )}
                    </div>

                    {/* Appointment Details Card */}
                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-3 md:mb-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-gray-800 text-sm md:text-base">Details</h4>
                        </div>
                        <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
                            <p><strong>Date:</strong> {currentAppointment.slotDate}</p>
                            <p><strong>Time:</strong> {currentAppointment.slotTime}</p>
                            <p><strong>Doctor:</strong> Dr. {currentAppointment.docData?.name}</p>
                        </div>
                    </div>

                    {/* Next Steps Card */}
                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-3 md:mb-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-gray-800 text-sm md:text-base">Next Steps</h4>
                        </div>
                        <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
                            {currentStatus === 'booked' && (
                                <>
                                    <p>• Complete payment</p>
                                    <p>• Arrive early</p>
                                    <p>• Bring ID card</p>
                                </>
                            )}
                            {currentStatus === 'paid' && (
                                <>
                                    <p>• Wait for turn</p>
                                    <p>• Keep reports ready</p>
                                    <p>• Meet doctor</p>
                                </>
                            )}
                            {currentStatus === 'medicine' && (
                                <>
                                    <p>• Collect medicines</p>
                                    <p>• Follow dosage</p>
                                    <p>• Schedule follow-up</p>
                                </>
                            )}
                            {currentStatus === 'completed' && (
                                <>
                                    <p>• Keep prescription</p>
                                    <p>• Follow advice</p>
                                    <p>• Provide feedback</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthMonitor;