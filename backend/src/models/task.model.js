import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  description: { type: String, default: 'Visa Invite Letter Sent' },
  status: { type: String, enum: ['pending', 'complete'], default: 'pending' },
  updatedAt: { type: Date, default: Date.now },
});

taskSchema.index({ bookingId: 1, status : 1 });

export default mongoose.model('Task', taskSchema);