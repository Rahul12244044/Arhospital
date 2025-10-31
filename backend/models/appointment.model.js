import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    docId: {type: String, required: true},
    slotDate: {type: String, required: true},
    slotTime: {type: String, required: true},
    userData: {type: Object, required: true},
    docData: {type: Object, required: true},
    amount: {type: Number, required: true},
    date: {type: Number, required: true},
    cancelled: {type: Boolean, default: false},
    payment: {type: Boolean, default: false}, // Keep this as payment
    paid: {type: Boolean, default: false}, // Add this new field
    paymentMethod: {type: String},
    paymentId: {type: String},
    paymentDate: {type: Date},
    gpayId: {type: String},
    isCompleted: {type: Boolean, default: false},
    status: {type: String, default: 'booked'}
}, { timestamps: true }); // Add timestamps for createdAt, updatedAt

export const appointmentModel = mongoose.model("Appointments", appointmentSchema);