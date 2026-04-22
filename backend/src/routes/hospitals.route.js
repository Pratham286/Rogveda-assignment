import express from "express"
import { getHospitalById, searchHospitals } from "../controllers/hospitals.controller.js";

const router = express.Router();

router.post("/", searchHospitals)
router.get("/:id", getHospitalById);

export default router;