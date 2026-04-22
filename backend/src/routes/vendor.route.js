import express from "express"
import { completeTask, getBookingDetails, getVendorBookings, vendorLogin } from "../controllers/vendor.controller.js";
import { verifyVendor } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", vendorLogin);

router.get("/bookings", verifyVendor, getVendorBookings);
router.get("/bookings/:bookingId", verifyVendor, getBookingDetails);
router.put("/tasks/:taskId", verifyVendor, completeTask);

export default router;