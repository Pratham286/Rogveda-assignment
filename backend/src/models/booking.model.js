import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  patientName: String,
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  hospitalName: String,
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  doctorName: String,
  roomType: String,
  priceUSD: Number,
  status: {
    type: String,
    enum: ['Confirmed', 'In Progress', 'Completed'],
    default: 'Confirmed',
  },
  createdAt: { type: Date, default: Date.now },
});

bookingSchema.index({ patientId: 1, createdAt : -1 });
bookingSchema.index({ status: 1, createdAt: -1 }); 

export default mongoose.model('Booking', bookingSchema);