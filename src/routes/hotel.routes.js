import { Router } from "express";
import { Rooms } from "../models/rooms.js"; // AGREGADO
import { createRoom, updateRoom, deleteRoom } from "../services/hotel.services.js";

const router = Router();

router.get("/home", (req, res) => {
	res.send("holaa xd");
});

// Ruta para obtener todos los rooms
router.get("/rooms", async (req, res) => { // AGREGADO
	try {
		const rooms = await Rooms.findAll();
		res.json({
			success: true,
			data: rooms,
			message: "Rooms obtenidos exitosamente"
		});
	} catch (error) {
		console.error("Error al obtener rooms:", error);
		res.status(500).json({
			success: false,
			message: "Error interno del servidor",
			error: error.message
		});
	}
});

// Ruta para obtener un room específico por ID
router.get("/rooms/:id", async (req, res) => { // AGREGADO
	try {
		const { id } = req.params;
		const room = await Rooms.findByPk(id);
		
		if (!room) {
			return res.status(404).json({
				success: false,
				message: "Room no encontrado"
			});
		}
		
		res.json({
			success: true,
			data: room,
			message: "Room obtenido exitosamente"
		});
	} catch (error) {
		console.error("Error al obtener room:", error);
		res.status(500).json({
			success: false,
			message: "Error interno del servidor",
			error: error.message
		});
	}
});

// Ruta para crear un nuevo room
router.post("/rooms", createRoom);

// Ruta para actualizar un room por ID
router.put("/rooms/:id", updateRoom);

// Ruta para eliminar un room por ID
router.delete("/rooms/:id", deleteRoom);

export default router;