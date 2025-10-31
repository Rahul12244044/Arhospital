import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentModal = ({ appointment, onSuccess, onClose, aToken }) => {
    const [gpayId, setGpayId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStep, setPaymentStep] = useState('input');

    const consultationFee = appointment.amount || 500;

    const handlePayment = async (e) => {
        e.preventDefault();
        
        if (!gpayId.trim()) {
            toast.error('Please enter your GPay ID');
            return;
        }

        const gpayRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[0-9]{10}$/;
        if (!gpayRegex.test(gpayId)) {
            toast.error('Please enter a valid GPay ID (email or phone number)');
            return;
        }

        setIsProcessing(true);
        setPaymentStep('processing');

        try {
            console.log('Starting payment for appointment:', appointment._id);
            
            const paymentData = {
                appointmentId: appointment._id,
                gpayId: gpayId,
                amount: consultationFee,
                paymentMethod: 'gpay'
            };

            const { data } = await axios.post(
                'http://localhost:4000/api/user/process-payment',
                paymentData,
                { 
                    headers: { token: aToken },
                    timeout: 10000 // 10 second timeout
                }
            );

            console.log('Payment response:', data);

            if (data.success) {
                setPaymentStep('success');
                toast.success('Payment completed successfully!');
                
                // Wait 2 seconds then close and refresh
                setTimeout(() => {
                    onSuccess();
                }, 2000);
            } else {
                throw new Error(data.message);
            }

        } catch (error) {
            console.error('Payment error:', error);
            setIsProcessing(false);
            setPaymentStep('input');
            toast.error(error.response?.data?.message || error.message || 'Payment failed. Please try again.');
        }
    };

    const handleClose = () => {
        if (!isProcessing) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">Complete Payment</h3>
                    {!isProcessing && (
                        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="p-6">
                    {paymentStep === 'input' && (
                        <form onSubmit={handlePayment} className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-800 mb-2">Appointment Details</h4>
                                <p className="text-sm text-blue-700">Dr. {appointment.docData.name}</p>
                                <p className="text-sm text-blue-700">{appointment.docData.speciality}</p>
                                <p className="text-sm text-blue-700">{appointment.slotDate} | {appointment.slotTime}</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Consultation Fee:</span>
                                    <span className="text-2xl font-bold text-green-600">₹{consultationFee}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">GPay ID</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={gpayId}
                                        onChange={(e) => setGpayId(e.target.value)}
                                        placeholder="Enter your GPay ID or mobile number"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        disabled={isProcessing}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                Pay ₹{consultationFee} with GPay
                            </button>
                        </form>
                    )}

                    {paymentStep === 'processing' && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Processing Payment</h4>
                            <p className="text-gray-600">Please wait while we process your payment...</p>
                        </div>
                    )}

                    {paymentStep === 'success' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Payment Successful!</h4>
                            <p className="text-gray-600">Redirecting back to appointments...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;