import mongoose from "mongoose";
const doctorSchema = new mongoose.Schema({
  name: String,
  experience: Number,
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
});

doctorSchema.index({ hospitalId: 1 }); // fetch doctors by hospital

export default mongoose.model('Doctor', doctorSchema);