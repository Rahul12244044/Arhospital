import React, { useState, useEffect, useContext } from 'react';
import { DoctorContext } from "../../context/doctorContext";
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorFeedback = () => {
    const { dToken, doctorData, getDoctorData } = useContext(DoctorContext);
    const [feedbacks, setFeedbacks] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalFeedbacks, setTotalFeedbacks] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    // Fetch feedback data
    const fetchFeedbacks = async () => {
        if (!dToken) return;
        
        setLoading(true);
        try {
            // If doctorData is not available, fetch it first
            let currentDoctorData = doctorData;
            if (!currentDoctorData) {
                currentDoctorData = await getDoctorData();
            }

            if (!currentDoctorData?._id) {
                toast.error('Doctor data not available');
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `https://arhospital.onrender.com/api/feedback/doctor/${currentDoctorData._id}`,
                { headers: { token: dToken } }
            );

            if (response.data.success) {
                // Format feedbacks to ensure userName exists
                const formattedFeedbacks = response.data.feedbacks.map(feedback => ({
                    ...feedback,
                    userName: feedback.userName || 'Anonymous Patient'
                }));
                
                setFeedbacks(formattedFeedbacks);
                setAverageRating(response.data.averageRating || 0);
                setTotalFeedbacks(response.data.totalFeedbacks || 0);
            } else {
                toast.error('Failed to fetch feedbacks');
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            if (error.response?.status === 404) {
                // No feedback found - set empty state
                setFeedbacks([]);
                setAverageRating(0);
                setTotalFeedbacks(0);
            } else {
                toast.error('Error loading feedbacks');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, [dToken, doctorData]);

    // Filter feedbacks based on rating
    const filteredFeedbacks = filter === 'all' 
        ? feedbacks 
        : feedbacks.filter(feedback => feedback.rating === parseInt(filter));

    // Calculate statistics from the feedbacks
    const calculateStatistics = () => {
        const total = feedbacks.length;
        const average = total > 0 
            ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / total
            : 0;
        
        const recommendationRate = total > 0
            ? (feedbacks.filter(f => f.wouldRecommend).length / total) * 100
            : 0;

        const ratingDistribution = {
            5: feedbacks.filter(f => f.rating === 5).length,
            4: feedbacks.filter(f => f.rating === 4).length,
            3: feedbacks.filter(f => f.rating === 3).length,
            2: feedbacks.filter(f => f.rating === 2).length,
            1: feedbacks.filter(f => f.rating === 1).length
        };

        return {
            averageRating: Math.round(average * 10) / 10,
            totalFeedbacks: total,
            recommendationRate: Math.round(recommendationRate),
            ratingDistribution
        };
    };

    const statistics = calculateStatistics();

    // Render star rating
    const renderStars = (rating) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`text-lg ${
                            star <= rating ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get user initial for avatar
    const getUserInitial = (userName) => {
        return userName?.charAt(0)?.toUpperCase() || 'P';
    };

    

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Patient Feedback</h1>
                    <p className="text-gray-600 mt-2">Reviews and ratings from your patients</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {/* Average Rating */}
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                            {statistics.averageRating.toFixed(1)}
                        </div>
                        <div className="flex justify-center mb-2">
                            {renderStars(Math.round(statistics.averageRating))}
                        </div>
                        <p className="text-gray-600 text-sm">Average Rating</p>
                    </div>

                    {/* Total Feedbacks */}
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                            {statistics.totalFeedbacks}
                        </div>
                        <p className="text-gray-600 text-sm">Total Reviews</p>
                    </div>

                    {/* Recommendation Rate */}
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                            {statistics.recommendationRate}%
                        </div>
                        <p className="text-gray-600 text-sm">Would Recommend</p>
                    </div>

                    {/* Response Rate */}
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                            {feedbacks.length > 0 ? Math.round((feedbacks.filter(f => f.comment && f.comment.trim().length > 0).length / feedbacks.length) * 100) : 0}%
                        </div>
                        <p className="text-gray-600 text-sm">With Comments</p>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Rating Distribution</h3>
                    <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = statistics.ratingDistribution[rating] || 0;
                            const percentage = statistics.totalFeedbacks > 0 
                                ? (count / statistics.totalFeedbacks) * 100 
                                : 0;
                            
                            return (
                                <div key={rating} className="flex items-center">
                                    <div className="w-16 flex items-center">
                                        <span className="text-gray-600 font-medium">{rating} ★</span>
                                    </div>
                                    <div className="flex-1 mx-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="w-16 text-right">
                                        <span className="text-sm text-gray-600">{count}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Filter and Feedback List */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">
                            Patient Reviews ({filteredFeedbacks.length})
                        </h3>
                        
                        {/* Filter Dropdown */}
                        <div className="flex items-center space-x-4">
                            <label className="text-sm text-gray-600">Filter by rating:</label>
                            <select 
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>
                    </div>

                    {filteredFeedbacks.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">💬</div>
                            <h4 className="text-xl font-semibold text-gray-600 mb-2">No Feedback Yet</h4>
                            <p className="text-gray-500">
                                {filter === 'all' 
                                    ? "You haven't received any feedback from patients yet."
                                    : `No ${filter}-star reviews found.`
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredFeedbacks.map((feedback) => (
                                <div key={feedback._id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                                        <div className="flex items-start space-x-3 mb-3 md:mb-0">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-semibold text-sm">
                                                    {getUserInitial(feedback.userName)}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800">
                                                    {feedback.userName}
                                                </h4>
                                                <p className="text-gray-500 text-sm">
                                                    {formatDate(feedback.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4">
                                            {renderStars(feedback.rating)}
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                feedback.wouldRecommend 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {feedback.wouldRecommend ? 'Would Recommend' : 'Not Recommended'}
                                            </div>
                                        </div>
                                    </div>

                                    {feedback.comment && (
                                        <div className="bg-gray-50 rounded-lg p-4 mt-3">
                                            <p className="text-gray-700 leading-relaxed">
                                                "{feedback.comment}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Appointment Details */}
                                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                                        <span>Patient Email: {feedback.userEmail}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Load More Button */}
                    {filteredFeedbacks.length > 0 && (
                        <div className="text-center mt-8">
                            <button 
                                onClick={fetchFeedbacks}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Refresh Feedbacks
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorFeedback;