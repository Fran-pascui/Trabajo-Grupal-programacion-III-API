import { Router } from "express";
import { verifyToken } from "../services/authMidleware.js";
import { emailAdminSearch } from "../services/sysadmin.services.js";
import { getAllReservations } from "../services/reservation.services.js";
import express from "express";

export const router = express.Router();

router.post("/admin/searchemail", emailAdminSearch);
router.get("/admin/reservations", verifyToken, getAllReservations);
export default router;