import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema({
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  roomType: {
    type: String,
    enum: ['General Ward', 'Semi-Private', 'Private', 'Suite'],
  },
  priceUSD: Number,
});

pricingSchema.index({ hospitalId: 1, doctorId: 1, roomType: 1 });

export default mongoose.model('Pricing', pricingSchema);