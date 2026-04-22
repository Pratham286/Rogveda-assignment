import express from "express"
import { createPatient } from "../controllers/patient.controller.js";

const router = express.Router();

router.post("/", createPatient);

export default router;