import { Router } from "express";
import { verifyToken } from "../services/authMidleware.js";
import { emailAdminSearch } from "../services/sysadmin.services.js";
import { getAllReservations } from "../services/reservation.services.js";
import { refreshRoomAvailability } from "../services/hotel.services.js";

const router = Router();

router.post("/admin/searchemail", verifyToken, emailAdminSearch);
router.get("/admin/reservations", verifyToken, getAllReservations);
router.post("/admin/refresh-availability", verifyToken, refreshRoomAvailability);

export default router;