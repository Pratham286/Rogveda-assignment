import patientModel from "../models/patient.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPatient = asyncHandler(async (req, res) => {
  const { name, email, phone, country } = req.body;
  if (!name || !email) throw new ApiError(400, "Name and email required.");
  // Find or create
  let patient = await patientModel.findOne({ email });
  if (!patient) patient = await Patient.create({ name, email, phone, country, walletBalance: 0 });
  return res.status(200).json(new ApiResponse(200, patient, "Patient ready."));
});