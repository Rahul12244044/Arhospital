// routes/feedback.js
import express from 'express';
import Feedback from "../controllers/feedback.controller.js";
const feedback=new Feedback();
const feedbackRouter = express.Router();

// Submit feedback
feedbackRouter.post('/submit',feedback.submitFeedback);

// Get feedback for a doctor
feedbackRouter.get('/doctor/:doctorId',feedback.getFeedback);

export default feedbackRouter;