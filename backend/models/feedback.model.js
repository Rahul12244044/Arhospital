// models/Feedback.js
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    appointmentId: { type: String, required: true },
    doctorId: { type: String, required: true },
    userId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    wouldRecommend: { type: Boolean, required: true },
    doctorName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userName:{type:String,required:true},
    createdAt: { type: Date, default: Date.now }
});

export const feedbackModel = mongoose.model("Feedback", feedbackSchema);