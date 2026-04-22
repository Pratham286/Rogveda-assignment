import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
import Task from "../models/task.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const VENDOR_CREDENTIALS = {
  username: "apollo",
  password: "apollo123",
};

// POST /api/vendor/login
export const vendorLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and password are required.");
  }

  if (
    username !== VENDOR_CREDENTIALS.username ||
    password !== VENDOR_CREDENTIALS.password
  ) {
    throw new ApiError(401, "Invalid credentials.");
  }

  // Hardcoded vendor — no JWT needed, just a simple session flag
  // Frontend stores this and sends it as a header for protected routes
  return res.status(200).json(
    new ApiResponse(
      200,
      { vendor: { username, name: "Apollo Spectra" }, token: "vendor-apollo-token" },
      "Login successful."
    )
  );
});


// GET /api/vendor/bookings
export const getVendorBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .sort({ createdAt: -1 })
    .lean();

  if (!bookings.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No bookings found."));
  }

  // Attach task to each booking
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
    .json(new ApiResponse(200, data, "Bookings fetched successfully."));
});

// GET /api/vendor/bookings/:bookingId
export const getBookingDetails = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ApiError(400, "Invalid booking ID.");
  }

  const booking = await Booking.findById(bookingId).lean();
  if (!booking) throw new ApiError(404, "Booking not found.");

  const task = await Task.findOne({ bookingId: booking._id }).lean();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...booking, task: task || null },
        "Booking details fetched successfully."
      )
    );
});

// PUT /api/vendor/tasks/:taskId
export const completeTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, "Invalid task ID.");
  }

  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(404, "Task not found.");

  if (task.status === "complete") {
    throw new ApiError(400, "Task is already marked as complete.");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Mark task complete
    task.status = "complete";
    task.updatedAt = new Date();
    await task.save({ session });

    // 2. Update booking status to "In Progress"
    const booking = await Booking.findByIdAndUpdate(
      task.bookingId,
      { status: "In Progress" },
      { new: true, session }
    );

    if (!booking) throw new ApiError(404, "Associated booking not found.");

    await session.commitTransaction();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { task, booking },
          "Task marked complete. Booking status updated to In Progress."
        )
      );
  } catch (error) {
    await session.abortTransaction();

    // Re-throw ApiErrors as-is, wrap unknown errors
    if (error.statusCode) throw error;
    throw new ApiError(500, "Failed to update task. Please try again.");
  } finally {
    session.endSession();
  }
});