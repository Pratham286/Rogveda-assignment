import Hospital from "../models/hospital.model.js";
import Doctor from "../models/doctor.model.js";
import Pricing from "../models/pricing.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const searchHospitals = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string" || query.trim() === "") {
    throw new ApiError(400, "Search query is required.");
  }

  const trimmed = query.trim();

  let hospitals = await Hospital.find(
    { $text: { $search: trimmed } },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });

  if (!hospitals.length) {
    const regex = new RegExp(trimmed, "i");
    hospitals = await Hospital.find({
      $or: [{ name: regex }, { procedure: regex }, { location: regex }],
    });
  }

  if (!hospitals.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No hospitals found for your search."));
  }

  const hospitalIds = hospitals.map((h) => h._id);

  const doctors = await Doctor.find({ hospitalId: { $in: hospitalIds } });

  const doctorsByHospital = {};
  for (const doc of doctors) {
    const key = doc.hospitalId.toString();
    if (!doctorsByHospital[key]) doctorsByHospital[key] = [];
    doctorsByHospital[key].push(doc);
  }

  const doctorIds = doctors.map((d) => d._id);

  const pricingRecords = await Pricing.find({
    hospitalId: { $in: hospitalIds },
    doctorId: { $in: doctorIds },
  });

  const pricingMap = {};
  for (const p of pricingRecords) {
    const hKey = p.hospitalId.toString();
    const dKey = p.doctorId.toString();
    if (!pricingMap[hKey]) pricingMap[hKey] = {};
    if (!pricingMap[hKey][dKey]) pricingMap[hKey][dKey] = {};
    pricingMap[hKey][dKey][p.roomType] = p.priceUSD;
  }

  const data = hospitals.map((hospital) => {
    const hKey = hospital._id.toString();
    const hospitalDoctors = doctorsByHospital[hKey] || [];

    const doctorsWithPricing = hospitalDoctors.map((doctor) => {
      const dKey = doctor._id.toString();
      const rooms = pricingMap[hKey]?.[dKey] || {};
      return {
        _id: doctor._id,
        name: doctor.name,
        experience: doctor.experience,
        pricing: rooms, // { "General Ward": 3200, "Semi-Private": 3800, ... }
      };
    });

    // Lowest price across all doctor-room combos for this hospital
    const hospitalPrices = pricingRecords
      .filter((p) => p.hospitalId.toString() === hKey)
      .map((p) => p.priceUSD);

    const lowestPrice = hospitalPrices.length
      ? Math.min(...hospitalPrices)
      : null;

    return {
      _id: hospital._id,
      name: hospital.name,
      location: hospital.location,
      procedure: hospital.procedure,
      image: hospital.image || null,
      lowestPrice,
      doctors: doctorsWithPricing,
    };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Hospitals fetched successfully."));
});

export const getHospitalById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid hospital ID.");
  }

  const hospital = await Hospital.findById(id);

  if (!hospital) {
    throw new ApiError(404, "Hospital not found.");
  }

  const doctors = await Doctor.find({ hospitalId: hospital._id });

  if (!doctors.length) {
    throw new ApiError(404, "No doctors found for this hospital.");
  }

  const doctorIds = doctors.map((d) => d._id);

  const pricingRecords = await Pricing.find({
    hospitalId: hospital._id,
    doctorId: { $in: doctorIds },
  });

  const hKey = hospital._id.toString();

  const doctorsWithPricing = doctors.map((doctor) => {
    const dKey = doctor._id.toString();
    const rooms = {};

    for (const p of pricingRecords) {
      if (p.doctorId.toString() === dKey) {
        rooms[p.roomType] = p.priceUSD;
      }
    }

    return {
      _id: doctor._id,
      name: doctor.name,
      experience: doctor.experience,
      pricing: rooms,
    };
  });

  const allPrices = pricingRecords.map((p) => p.priceUSD);
  const lowestPrice = allPrices.length ? Math.min(...allPrices) : null;

  const data = {
    _id: hospital._id,
    name: hospital.name,
    location: hospital.location,
    procedure: hospital.procedure,
    image: hospital.image || null,
    lowestPrice,
    doctors: doctorsWithPricing,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Hospital fetched successfully."));
});