import { Router } from "express";
import { Rooms } from "../models/rooms.js";
import {
	createRoom,
	updateRoom,
	deleteRoom,
	checkRoomAvailability,
} from "../services/hotel.services.js";
import { login, register } from "../services/auth.services.js";
import {
	deleteReservation,
	Reservation,
} from "../services/reservation.services.js";
import { verifyToken } from "../services/authMidleware.js";
import servicesRoutes from "./services.routes.js";
import usersRoutes from "./users.routes.js";
import { emailAdminSearch } from "../services/sysadmin.services.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/Reservation", verifyToken, Reservation);
router.delete("/:id", verifyToken, deleteReservation);

router.post("/admin/searchemail", verifyToken, emailAdminSearch);

router.get("/rooms", async (req, res) => {
	try {
		const rooms = await Rooms.findAll();
		res.json({
			success: true,
			data: rooms,
			message: "Rooms obtenidos exitosamente",
		});
	} catch (error) {
		console.error("Error al obtener rooms:", error);
		res.status(500).json({
			success: false,
			message: "Error interno del servidor",
			error: error.message,
		});
	}
});
router.get("/rooms/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const room = await Rooms.findByPk(id);

		if (!room) {
			return res.status(404).json({
				success: false,
				message: "Room no encontrado",
			});
		}

		res.json({
			success: true,
			data: room,
			message: "Room obtenido exitosamente",
		});
	} catch (error) {
		console.error("Error al obtener room:", error);
		res.status(500).json({
			success: false,
			message: "Error interno del servidor",
			error: error.message,
		});
	}
});
router.get("/availability", checkRoomAvailability);
router.post("/rooms", createRoom);
router.put("/rooms/:id", updateRoom);
router.delete("/rooms/:id", deleteRoom);
router.use("/services", servicesRoutes);
router.use("/users", usersRoutes);

export default router;
