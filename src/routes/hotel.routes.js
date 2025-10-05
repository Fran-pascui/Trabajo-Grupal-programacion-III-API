import { Router } from "express";
import { Rooms } from "../models/rooms.js";
import {
	createRoom,
	updateRoom,
	deleteRoom,
	register,
	login,
} from "../services/hotel.services.js";
const router = Router();

router.get("/home", (req, res) => {
	res.send("holaa xd");
});

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

router.post("/register", register);
router.post("/login", login);

router.post("/rooms", createRoom);

router.put("/rooms/:id", updateRoom);

router.delete("/rooms/:id", deleteRoom);

export default router;
