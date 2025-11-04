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
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackData, setFeedbackData] = useState({
        rating: 0,
        comment: '',
        wouldRecommend: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);

    // Determine initial status based on appointment data
    function getInitialStatus(apt) {
        if (!apt) return 'booked';
        if (apt.cancelled) return 'cancelled';
        if (apt.isCompleted) return 'completed';
        if (apt.medicinePrescribed) return 'medicine';
        if (apt.paid) return 'paid';
        return 'booked';
    }

    // Check if feedback already exists for this appointment
    const checkExistingFeedback = async () => {
        if (!currentAppointment?._id || !aToken) return;
        
        try {
            const response = await axios.get(
                `https://arhospital.onrender.com/api/feedback/appointment/${currentAppointment._id}`,
                { headers: { token: aToken } }
            );
            
            if (response.data.success && response.data.exists) {
                setHasSubmittedFeedback(true);
            }
        } catch (error) {
            // If no feedback exists, it's fine - just keep hasSubmittedFeedback as false
            console.log('No existing feedback found or error checking:', error);
        }
    };

    // Fetch updated appointment data
    const fetchAppointmentData = async () => {
        if (!currentAppointment?._id || !aToken) return;
        
        try {
            const { data } = await axios.get(
                `https://arhospital.onrender.com/api/user/appointment/${currentAppointment._id}`,
                { headers: { token: aToken } }
            );
            
            if (data.success && data.appointment) {
                setCurrentAppointment(data.appointment);
                setCurrentStatus(getInitialStatus(data.appointment));
            }
        } catch (error) {
            console.error('Error fetching appointment:', error);
        }
    };

    // Fetch data when component mounts
    useEffect(() => {
        if (currentAppointment?._id) {
            fetchAppointmentData();
            checkExistingFeedback();
        }
    }, [currentAppointment?._id]);

    // Feedback Functions
    const handleFeedbackClick = () => {
        setShowFeedback(true);
    };

    const handleCloseFeedback = () => {
        setShowFeedback(false);
        setFeedbackData({
            rating: 0,
            comment: '',
            wouldRecommend: null
        });
    };

    const handleRatingChange = (rating) => {
        setFeedbackData(prev => ({ ...prev, rating }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFeedbackData(prev => ({ ...prev, [name]: value }));
    };

    const handleRecommendationChange = (value) => {
        setFeedbackData(prev => ({ ...prev, wouldRecommend: value }));
    };

    const submitFeedback = async () => {
        if (!feedbackData.rating) {
            toast.error('Please provide a rating');
            return;
        }

        if (!feedbackData.comment.trim()) {
            toast.error('Please provide your feedback comments');
            return;
        }

        if (feedbackData.wouldRecommend === null) {
            toast.error('Please indicate if you would recommend this doctor');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(
                'https://arhospital.onrender.com/api/feedback/submit',
                {
                    appointmentId: currentAppointment._id,
                    doctorId: currentAppointment.docId,
                    userId: currentAppointment.userId,
                    rating: feedbackData.rating,
                    comment: feedbackData.comment,
                    wouldRecommend: feedbackData.wouldRecommend,
                    doctorName: currentAppointment.docData?.name,
                    userEmail: currentAppointment.userData?.email
                },
                { 
                    headers: { 
                        token: aToken,
                        'Content-Type': 'application/json'
                    } 
                }
            );

            if (response.data.success) {
                toast.success('Thank you for your feedback!');
                setHasSubmittedFeedback(true);
                handleCloseFeedback();
            } else {
                toast.error(response.data.message || 'Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            if (error.response && error.response.data) {
                toast.error(error.response.data.message || 'Error submitting feedback');
            } else {
                toast.error('Network error. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

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
                return { ...stage, status: 'pending' };
            }
            
            // Stage 3 - Medicine Point
            if (stage.id === 3) {
                if (['medicine', 'completed'].includes(currentStatus)) {
                    return { ...stage, status: 'completed' };
                }
                if (currentStatus === 'paid') {
                    return { ...stage, status: 'current' };
                }
                return { ...stage, status: 'pending' };
            }
            
            // Stage 4 - Complete Appointment
            if (stage.id === 4) {
                if (currentStatus === 'completed') {
                    return { ...stage, status: 'completed' };
                }
                if (currentStatus === 'medicine') {
                    return { ...stage, status: 'current' };
                }
                return { ...stage, status: 'pending' };
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
                    new Date(currentAppointment.createdAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }) : 
                    currentAppointment.slotDate || now;
            case 2:
                return currentAppointment.paymentDate ? 
                    new Date(currentAppointment.paymentDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }) : 
                    (currentAppointment.paid ? 'Completed' : 'Pending');
            case 3:
                return currentAppointment.medicineDate ? 
                    new Date(currentAppointment.medicineDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }) : 
                    (currentStatus === 'medicine' || currentStatus === 'completed' ? 'Completed' : 'Pending');
            case 4:
                return currentAppointment.completionDate ? 
                    new Date(currentAppointment.completionDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }) : 
                    (currentStatus === 'completed' ? 'Completed' : 'Pending');
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
                    'Doctor will prescribe medicines after consultation';
            case 4:
                return currentStatus === 'completed' ?
                    'Appointment completed successfully' :
                    'Final stage after medicine prescription';
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 md:p-4 relative">
            {/* Feedback Modal Overlay */}
            {showFeedback && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all">
                        {/* Modal Header */}
                        <div className="bg-blue-600 text-white p-4 rounded-t-xl">
                            <h3 className="text-xl font-bold">Share Your Experience</h3>
                            <p className="text-blue-100 text-sm mt-1">
                                Help us improve by providing feedback for Dr. {currentAppointment.docData?.name}
                            </p>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-6">
                            {/* Rating Section */}
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-3">
                                    Overall Rating *
                                </label>
                                <div className="flex justify-center space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleRatingChange(star)}
                                            className={`text-3xl transition-transform ${
                                                star <= feedbackData.rating
                                                    ? 'text-yellow-500 scale-110'
                                                    : 'text-gray-300 hover:text-yellow-400'
                                            }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <div className="text-center text-sm text-gray-600 mt-2">
                                    {feedbackData.rating === 0 && 'Select your rating'}
                                    {feedbackData.rating === 1 && 'Poor'}
                                    {feedbackData.rating === 2 && 'Fair'}
                                    {feedbackData.rating === 3 && 'Good'}
                                    {feedbackData.rating === 4 && 'Very Good'}
                                    {feedbackData.rating === 5 && 'Excellent'}
                                </div>
                            </div>

                            {/* Comment Section */}
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Your Feedback *
                                </label>
                                <textarea
                                    name="comment"
                                    value={feedbackData.comment}
                                    onChange={handleInputChange}
                                    placeholder="Share your experience with the doctor, treatment, and overall service..."
                                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    maxLength={500}
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {feedbackData.comment.length}/500
                                </div>
                            </div>

                            {/* Recommendation Section */}
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-3">
                                    Would you recommend Dr. {currentAppointment.docData?.name} to others? *
                                </label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => handleRecommendationChange(true)}
                                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                                            feedbackData.wouldRecommend === true
                                                ? 'bg-green-100 border-green-500 text-green-700'
                                                : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        👍 Yes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRecommendationChange(false)}
                                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                                            feedbackData.wouldRecommend === false
                                                ? 'bg-red-100 border-red-500 text-red-700'
                                                : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        👎 No
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleCloseFeedback}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitFeedback}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Feedback'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content with conditional opacity */}
            <div className={`max-w-6xl mx-auto transition-opacity duration-300 ${
                showFeedback ? 'opacity-30 pointer-events-none' : 'opacity-100'
            }`}>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-xl md:text-3xl font-bold text-gray-800">Appointment Tracker</h1>
                        <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Track your appointment progress</p>
                    </div>
                    <div className="flex justify-center md:justify-end">
                        <button 
                            onClick={handleBackToAppointments}
                            className="bg-white text-gray-700 px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                        >
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Appointments
                        </button>
                    </div>
                </div>

                {/* Appointment Info Card */}
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                        <div className="flex items-center gap-3 md:gap-4">
                            <img 
                                src={currentAppointment.docData?.image || '/default-doctor.png'} 
                                alt="Doctor" 
                                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-blue-200"
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
                        {/* Progress Line Container - Fixed positioning */}
                        <div className="absolute top-4 md:top-6 left-8 md:left-12 right-8 md:right-12 h-1 md:h-2 z-10">
                            <div className="flex justify-between items-center w-full h-full">
                                {/* Main progress line background */}
                                <div className="absolute top-0 left-0 right-0 h-full bg-gray-300 rounded-full"></div>
                                
                                {/* Completed progress line */}
                                {currentStatus !== 'cancelled' && (
                                    <div 
                                        className="absolute top-0 left-0 h-full bg-green-500 rounded-full transition-all duration-500 w-90"
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
                    <div className={`rounded-lg p-3 md:p-4 border-l-4 mt-8 ${
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
                            {currentStatus === 'completed' && 'Your appointment has been successfully completed. Thank you for choosing our service!'}
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
                            <h4 className="font-semibold text-gray-800 text-sm md:text-base">Payment Status</h4>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                            {currentAppointment?.paid ? 
                                `Payment of ₹${currentAppointment.amount || 500} completed successfully` : 
                                'Payment pending for appointment confirmation'
                            }
                        </p>
                        {!currentAppointment?.paid && !currentAppointment?.cancelled && !currentAppointment?.isCompleted && (
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
                            <h4 className="font-semibold text-gray-800 text-sm md:text-base">Appointment Details</h4>
                        </div>
                        <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
                            <p><strong>Date:</strong> {currentAppointment.slotDate}</p>
                            <p><strong>Time:</strong> {currentAppointment.slotTime}</p>
                            <p><strong>Doctor:</strong> Dr. {currentAppointment.docData?.name}</p>
                            <p><strong>Speciality:</strong> {currentAppointment.docData?.speciality || 'General Physician'}</p>
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
                                    <p>• Complete payment to confirm appointment</p>
                                    <p>• Arrive 15 minutes before scheduled time</p>
                                    <p>• Bring your ID and previous medical reports</p>
                                </>
                            )}
                            {currentStatus === 'paid' && (
                                <>
                                    <p>• Wait for your turn in the waiting area</p>
                                    <p>• Keep your medical reports ready</p>
                                    <p>• Meet the doctor for consultation</p>
                                </>
                            )}
                            {currentStatus === 'medicine' && (
                                <>
                                    <p>• Collect prescribed medicines from pharmacy</p>
                                    <p>• Follow dosage instructions carefully</p>
                                    <p>• Schedule follow-up if required</p>
                                </>
                            )}
                            {currentStatus === 'completed' && (
                                <>
                                    <p>• Keep prescription safe for future reference</p>
                                    <p>• Follow doctor's advice and medication</p>
                                    <p>
{hasSubmittedFeedback ? (
                                    <span className="text-green-600 font-medium flex items-center gap-2 text-sm sm:text-base">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Thank you for your feedback!
                                    </span>
                                    ) : (
                                    <button 
                                    onClick={handleFeedbackClick}
                                    className="w-full sm:w-auto bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                                 >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    Provide Feedback
                                    </button>
                            )}
                                    </p>
                                </>
                            )}
                            {currentStatus === 'cancelled' && (
                                <>
                                    <p>• This appointment has been cancelled</p>
                                    <p>• Contact support for refund if applicable</p>
                                    <p>• Book a new appointment if required</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mt-4 md:mt-6">
                    <h4 className="font-semibold text-gray-800 mb-3 md:mb-4 text-sm md:text-base">Need Help?</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm text-gray-600">
                        <div>
                            <p><strong>Contact Support:</strong> +1-234-567-890</p>
                            <p><strong>Email:</strong> support@hospital.com</p>
                        </div>
                        <div>
                            <p><strong>Hospital Address:</strong> 123 Medical Center, City</p>
                            <p><strong>Emergency:</strong> Available 24/7</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthMonitor;