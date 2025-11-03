import { feedbackModel } from "../models/feedback.model.js";
import { userModel } from "../models/userModel.js"; // Import user model

export default class Feedback {
    submitFeedback = async (req, res, next) => {
        try {
            const {
                appointmentId,
                doctorId,
                userId,
                rating,
                comment,
                wouldRecommend,
                doctorName,
                userEmail
                // Remove userName from here since we'll get it from user data
            } = req.body;

            // Check if feedback already exists for this appointment
            const existingFeedback = await feedbackModel.findOne({ appointmentId });
            if (existingFeedback) {
                return res.json({
                    success: false,
                    message: 'Feedback already submitted for this appointment'
                });
            }

            // Get user data to get the actual user name
            const user = await userModel.findById(userId);
            if (!user) {
                return res.json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Create new feedback
            const feedback = new feedbackModel({
                appointmentId,
                doctorId,
                userId,
                rating,
                comment,
                wouldRecommend,
                doctorName,
                userEmail,
                userName: user.name // Get actual user name from user document
            });

            await feedback.save();

            res.json({
                success: true,
                message: 'Feedback submitted successfully',
                feedback
            });
        } catch (error) {
            next(error);
        }
    }

    getFeedback = async (req, res, next) => {
        try {
            const { doctorId } = req.params;
            console.log("doctorId: ", doctorId);

            // Populate user data to get userName
            const feedbacks = await feedbackModel.find({ doctorId })
                .sort({ createdAt: -1 })
                .limit(50)
                .populate({
                    path: 'userId',
                    select: 'name email', // Select only name and email fields
                    model: userModel
                });

            console.log("Populated feedbacks: ", JSON.stringify(feedbacks, null, 2));

            // Calculate average rating
            const averageRating = feedbacks.length > 0
                ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length
                : 0;

            // Format feedbacks to include proper userName
            const formattedFeedbacks = feedbacks.map(feedback => {
                // Get user name from populated user data or fallback to stored userName
                const userName = feedback.userId?.name || feedback.userName || 'Anonymous Patient';
                
                return {
                    _id: feedback._id,
                    appointmentId: feedback.appointmentId,
                    doctorId: feedback.doctorId,
                    userId: feedback.userId,
                    rating: feedback.rating,
                    comment: feedback.comment,
                    wouldRecommend: feedback.wouldRecommend,
                    doctorName: feedback.doctorName,
                    userEmail: feedback.userEmail,
                    userName: userName,
                    createdAt: feedback.createdAt,
                    __v: feedback.__v
                };
            });

            res.json({
                success: true,
                feedbacks: formattedFeedbacks,
                averageRating: Math.round(averageRating * 10) / 10,
                totalFeedbacks: feedbacks.length
            });
        } catch (error) {
            console.error("Error in getFeedback:", error);
            next(error);
        }
    }
}