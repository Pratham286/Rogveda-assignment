import express from "express"
import { createBooking, getPatientBookings } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/:patientId", getPatientBookings);

export default router;