// const mongoose = require('mongoose');
import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: String,
  location: String,
  procedure: String,
  image: String,
});

hospitalSchema.index({ name: 'text' });

export default mongoose.model('Hospital', hospitalSchema);