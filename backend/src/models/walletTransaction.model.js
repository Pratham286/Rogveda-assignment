import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  amount: Number,
  type: { type: String, enum: ['debit', 'credit'] },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

walletTransactionSchema.index({ patientId: 1, createdAt: -1 });

export default mongoose.model('WalletTransaction', walletTransactionSchema);