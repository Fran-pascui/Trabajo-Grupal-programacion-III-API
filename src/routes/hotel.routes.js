import { Router } from "express";
import { Rooms } from "../models/rooms.js";
import { Reservations } from "../models/reservation.js";
import { Op } from "sequelize";
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
	getAllReservations,
	cancelReservation,
} from "../services/reservation.services.js";
import { verifyToken } from "../services/authMidleware.js";
import servicesRoutes from "./services.routes.js";
import usersRoutes from "./users.routes.js";
import {
	emailAdminSearch,
	updateRol,
	changeActive,
} from "../services/sysadmin.services.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/Reservation", verifyToken, Reservation);
router.delete("/:id", verifyToken, deleteReservation);
router.put("/reservations/:id/cancel", verifyToken, cancelReservation);

router.post("/admin/searchemail", verifyToken, emailAdminSearch);
router.put("/updateRole", verifyToken, updateRol);
router.put("/:dni/toggle-active", verifyToken, changeActive);

router.get("/rooms", async (req, res) => {
	try {
		const rooms = await Rooms.findAll();
		const reservations = await Reservations.findAll();
		
	
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		
		
		const activeReservations = {};
		const todayString = today.toISOString().split('T')[0];
		
		reservations.forEach(reservation => {
			try {
				const reservationData = reservation.toJSON ? reservation.toJSON() : reservation;
				
				
				if (!reservationData.checkOut) {
					return; 
				}
				
				
				const reservationStatus = reservationData.status || 'active';
				if (reservationStatus === 'active') {
					try {
						
						const checkOutDate = new Date(reservationData.checkOut);
						
						
						if (isNaN(checkOutDate.getTime())) {
							console.warn(`[Hotel][ROOMS][WARNING] Reserva ${reservationData.Id} con checkOut inválido: ${reservationData.checkOut}`);
							return;
						}
						
						checkOutDate.setHours(0, 0, 0, 0);
						const checkOutString = checkOutDate.toISOString().split('T')[0];
						
						
						if (checkOutString >= todayString) {
							activeReservations[reservationData.room_Id] = true;
						}
					} catch (dateError) {
						console.warn(`[Hotel][ROOMS][WARNING] Error al procesar fecha checkOut de reserva ${reservationData.Id}:`, dateError.message);
					}
				}
				
			} catch (error) {
				console.warn(`[Hotel][ROOMS][WARNING] Error al procesar reserva:`, error.message);
			}
		});
		
	
		const roomsWithAvailability = rooms.map(room => ({
			...room.toJSON(),
			Disponible: !activeReservations[room.Id]
		}));
		
		
		for (const room of rooms) {
			const isActuallyAvailable = !activeReservations[room.Id];
			if (room.Disponible !== isActuallyAvailable) {
				await Rooms.update(
					{ Disponible: isActuallyAvailable },
					{ where: { Id: room.Id } }
				);
			}
		}
		
		res.json({
			success: true,
			data: roomsWithAvailability,
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

		
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		
		
		let isActuallyAvailable = true;
		
		try {
			
			const activeReservations = await Reservations.findAll({
				where: {
					room_Id: id,
					[Op.or]: [
						{ status: 'active' },
						{ status: null }
					]
				}
			});
			
			const todayString = today.toISOString().split('T')[0];
			
		
			for (const reservation of activeReservations) {
				try {
					const reservationData = reservation.toJSON ? reservation.toJSON() : reservation;
					
					
					const reservationStatus = reservationData.status || 'active';
					if (reservationStatus !== 'active') {
						continue; 
					}
					
					if (!reservationData.checkOut) {
						continue;
					}
					
					const checkOutDate = new Date(reservationData.checkOut);
					
					if (isNaN(checkOutDate.getTime())) {
						console.warn(`[Hotel][ROOMS/:id][WARNING] Reserva ${reservationData.Id} con checkOut inválido: ${reservationData.checkOut}`);
						continue;
					}
					
					checkOutDate.setHours(0, 0, 0, 0);
					const checkOutString = checkOutDate.toISOString().split('T')[0];
					
					if (checkOutString >= todayString) {
						isActuallyAvailable = false;
						break; 
					}
				} catch (dateError) {
					console.warn(`[Hotel][ROOMS/:id][WARNING] Error al procesar fecha checkOut de reserva ${reservation?.Id || 'unknown'}:`, dateError.message);
				}
			}
		} catch (error) {
			console.warn(`[Hotel][ROOMS/:id][WARNING] Error al buscar reservas:`, error.message);
		}
		
		
		if (room.Disponible !== isActuallyAvailable) {
			await Rooms.update(
				{ Disponible: isActuallyAvailable },
				{ where: { Id: id } }
			);
		}

		res.json({
			success: true,
			data: {
				...room.toJSON(),
				Disponible: isActuallyAvailable
			},
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
