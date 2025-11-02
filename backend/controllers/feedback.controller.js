import {feedbackModel} from "../models/feedback.model.js";
export default class Feedback{
     submitFeedback=async (req,res,next)=>{
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
                } = req.body;
        
                // Check if feedback already exists for this appointment
                const existingFeedback = await feedbackModel.findOne({ appointmentId });
                if (existingFeedback) {
                    return res.json({
                        success: false,
                        message: 'Feedback already submitted for this appointment'
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
                    userEmail
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
     getFeedback=async (req,res,next)=>{
        try {
                const { doctorId } = req.params;
                
                const feedbacks = await feedbackModel.find({ doctorId })
                    .sort({ createdAt: -1 })
                    .limit(50);
        
                // Calculate average rating
                const averageRating = feedbacks.length > 0 
                    ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length
                    : 0;
        
                res.json({
                    success: true,
                    feedbacks,
                    averageRating: Math.round(averageRating * 10) / 10,
                    totalFeedbacks: feedbacks.length
                });
            } catch (error) {
               next(error);
            }
     }
}