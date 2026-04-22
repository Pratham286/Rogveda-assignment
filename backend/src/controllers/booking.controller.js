import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
import Patient from "../models/patient.model.js";
import Pricing from "../models/pricing.model.js";
import Hospital from "../models/hospital.model.js";
import Doctor from "../models/doctor.model.js";
import WalletTransaction from "../models/walletTransaction.model.js";
import Task from "../models/task.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /api/booking
export const createBooking = asyncHandler(async (req, res) => {
  const { patientId, hospitalId, doctorId, roomType } = req.body;

  // ── Input validation ────────────────────────────────────
  if (!patientId || !hospitalId || !doctorId || !roomType) {
    throw new ApiError(400, "patientId, hospitalId, doctorId and roomType are all required.");
  }

  const invalidIds = [patientId, hospitalId, doctorId].filter(
    (id) => !mongoose.Types.ObjectId.isValid(id)
  );
  if (invalidIds.length) {
    throw new ApiError(400, "One or more provided IDs are invalid.");
  }

  const validRoomTypes = ["General Ward", "Semi-Private", "Private", "Suite"];
  if (!validRoomTypes.includes(roomType)) {
    throw new ApiError(
      400,
      `Invalid room type. Must be one of: ${validRoomTypes.join(", ")}.`
    );
  }

  // ── Verify all entities exist ───────────────────────────
  const [patient, hospital, doctor] = await Promise.all([
    Patient.findById(patientId),
    Hospital.findById(hospitalId),
    Doctor.findById(doctorId),
  ]);

  if (!patient) throw new ApiError(404, "Patient not found.");
  if (!hospital) throw new ApiError(404, "Hospital not found.");
  if (!doctor) throw new ApiError(404, "Doctor not found.");

  // Ensure doctor actually belongs to this hospital
  if (doctor.hospitalId.toString() !== hospitalId) {
    throw new ApiError(400, "This doctor does not belong to the selected hospital.");
  }

  // ── Fetch price for this exact combination ──────────────
  const pricing = await Pricing.findOne({ hospitalId, doctorId, roomType });

  if (!pricing) {
    throw new ApiError(
      404,
      "No pricing found for the selected doctor and room type combination."
    );
  }

  // ── Atomic booking creation (session + transaction) ─────
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Deduct from wallet (allow negative — BNPL)
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $inc: { walletBalance: -pricing.priceUSD } },
      { new: true, session }
    );

    // 2. Create booking record
    const [booking] = await Booking.create(
      [
        {
          patientId: patient._id,
          patientName: patient.name,
          hospitalId: hospital._id,
          hospitalName: hospital.name,
          doctorId: doctor._id,
          doctorName: doctor.name,
          roomType,
          priceUSD: pricing.priceUSD,
          status: "Confirmed",
        },
      ],
      { session }
    );

    // 3. Create wallet transaction record
    await WalletTransaction.create(
      [
        {
          patientId: patient._id,
          bookingId: booking._id,
          amount: pricing.priceUSD,
          type: "debit",
          description: `Booking for ${hospital.name} — ${doctor.name} — ${roomType}`,
        },
      ],
      { session }
    );

    // 4. Create vendor task for this booking
    await Task.create(
      [
        {
          bookingId: booking._id,
          description: "Visa Invite Letter Sent",
          status: "pending",
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          bookingId: booking._id,
          patientName: patient.name,
          hospitalName: hospital.name,
          doctorName: doctor.name,
          roomType,
          priceUSD: pricing.priceUSD,
          status: booking.status,
          walletBalance: updatedPatient.walletBalance,
          createdAt: booking.createdAt,
        },
        "Booking confirmed successfully."
      )
    );
  } catch (error) {
    await session.abortTransaction();
    throw new ApiError(500, "Booking failed. Please try again.");
  } finally {
    session.endSession();
  }
});

// GET /api/booking/:patientId
export const getPatientBookings = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    throw new ApiError(400, "Invalid patient ID.");
  }

  const patient = await Patient.findById(patientId);
  if (!patient) throw new ApiError(404, "Patient not found.");

  const bookings = await Booking.find({ patientId })
    .sort({ createdAt: -1 })
    .lean();

  if (!bookings.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No bookings found for this patient."));
  }

  // Attach task status to each booking
  const bookingIds = bookings.map((b) => b._id);
  const tasks = await Task.find({ bookingId: { $in: bookingIds } }).lean();

  const taskByBooking = {};
  for (const task of tasks) {
    taskByBooking[task.bookingId.toString()] = task;
  }

  const data = bookings.map((booking) => ({
    ...booking,
    task: taskByBooking[booking._id.toString()] || null,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { walletBalance: patient.walletBalance, bookings: data },
        "Bookings fetched successfully."
      )
    );
});