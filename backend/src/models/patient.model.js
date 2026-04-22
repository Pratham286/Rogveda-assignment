import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  country: String,
  walletBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Patient', patientSchema);