import { Op } from "sequelize";

import { User } from "../models/user.js";
import { Rooms } from "../models/rooms.js";
import { Reservations } from "../models/reservation.js";

export const createRoom = async (req, res) => {
	console.log("🚀 RUTA POST /rooms EJECUTÁNDOSE");
	console.log("📥 Datos recibidos:", req.body);

	try {
		const roomData = req.body;
		const newRoom = await Rooms.create(roomData);

		console.log("✅ Habitación creada:", newRoom);

		res.status(201).json({
			success: true,
			data: newRoom,
			message: "Room creado exitosamente",
		});
	} catch (error) {
		console.error("❌ Error al crear room:", error);
		res.status(500).json({
			success: false,
			message: "Error interno del servidor",
			error: error.message,
		});
	}
};

export const updateRoom = async (req, res) => {
	try {
		const { id } = req.params;
		const roomData = req.body;

		const [updatedRowsCount] = await Rooms.update(roomData, {
			where: { Id: id },
		});

		if (updatedRowsCount === 0) {
			return res.status(404).json({
				success: false,
				message: "Room no encontrado",
			});
		}

		const updatedRoom = await Rooms.findByPk(id);

		res.json({
			success: true,
			data: updatedRoom,
			message: "Room actualizado exitosamente",
		});
	} catch (error) {
		console.error("Error al actualizar room:", error);
		res.status(500).json({
			success: false,
			message: "Error interno del servidor",
			error: error.message,
		});
	}
};

export const getAllRooms = async (req, res) => {
	try {
		const { tipo, capacidad } = req.query;
		let whereClause = {};

		if (tipo) {
			whereClause.Tipo = tipo;
		}

		if (capacidad) {
			whereClause.Capacidad = capacidad;
		}

		const rooms = await Rooms.findAll({
			where: whereClause,
		});

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
};

export const getRoomById = async (req, res) => {
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
};

export const deleteRoom = async (req, res) => {
	try {
		const { id } = req.params;

		const deletedRowsCount = await Rooms.destroy({
			where: { Id: id },
		});

		if (deletedRowsCount === 0) {
			return res.status(404).json({
				success: false,
				message: "Room no encontrado",
			});
		}

		res.json({
			success: true,
			message: "Room eliminado exitosamente",
		});
	} catch (error) {
		console.error("Error al eliminar room:", error);
		res.status(500).json({
			success: false,
			message: "Error interno del servidor",
			error: error.message,
		});
	}
};

export const checkRoomAvailability = async (req, res) => {
	try {
		const { fechaInicio, fechaFin, cantidadHabitaciones, cantidadPersonas } =
			req.query;

		if (
			!fechaInicio ||
			!fechaFin ||
			!cantidadHabitaciones ||
			!cantidadPersonas
		) {
			return res.status(400).json({
				success: false,
				message:
					"Faltan parámetros requeridos: fechaInicio, fechaFin, cantidadHabitaciones, cantidadPersonas",
			});
		}

		const fechaInicioDB = new Date(fechaInicio).toISOString().split("T")[0];
		const fechaFinDB = new Date(fechaFin).toISOString().split("T")[0];

		
		const habitacionesDisponibles = await Rooms.findAll({
			where: {
				Personas: {
					[Op.gte]: cantidadPersonas,
				},
			},
		});

		
		const reservasExistentes = await Reservations.findAll({
			where: {
				status: 'active', 
				[Op.or]: [
					{
						checkIn: {
							[Op.between]: [fechaInicioDB, fechaFinDB]
						}
					},
					{
						checkOut: {
							[Op.between]: [fechaInicioDB, fechaFinDB]
						}
					},
					{
						[Op.and]: [
							{
								checkIn: {
									[Op.lte]: fechaInicioDB
								}
							},
							{
								checkOut: {
									[Op.gte]: fechaFinDB
								}
							}
						]
					}
				]
			},
		});

		
		const habitacionesReservadas = new Set(
			reservasExistentes.map(reserva => reserva.room_Id)
		);

		const habitacionesRealmenteDisponibles = habitacionesDisponibles.filter(
			(habitacion) => !habitacionesReservadas.has(habitacion.Id)
		);

		const hayDisponibilidad =
			habitacionesRealmenteDisponibles.length >= parseInt(cantidadHabitaciones);

		res.json({
			success: true,
			data: {
				disponible: hayDisponibilidad,
				habitacionesDisponibles: habitacionesRealmenteDisponibles.length,
				habitacionesRequeridas: parseInt(cantidadHabitaciones),
				fechaInicio: fechaInicioDB,
				fechaFin: fechaFinDB,
				habitaciones: habitacionesRealmenteDisponibles.map(room => ({
					Id: room.Id,
					RoomNo: room.RoomNo,
					Nombre: room.Nombre,
					Tipo: room.Tipo,
					Capacidad: room.Capacidad,
					Tarifa: room.Tarifa
				})),

				mensaje: hayDisponibilidad
					? "Habitaciones disponibles para las fechas solicitadas"
					: "No hay habitaciones disponibles para las fechas solicitadas",
			},
			message: "Consulta de disponibilidad completada",
		});
	} catch (error) {
		console.error("Error al verificar disponibilidad:", error);
		res.status(500).json({
			success: false,
			message: "Error interno del servidor",
			error: error.message,
		});
	}
};


export const refreshRoomAvailability = async (req, res) => {
	try {
		console.log('[Hotel][REFRESH_AVAILABILITY][REQUEST]', 'Refrescando disponibilidades...');
		
		const rooms = await Rooms.findAll();
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const todayString = today.toISOString().split('T')[0];
		
		
		const allReservations = await Reservations.findAll();
		
	
		const occupiedRooms = new Set();
		allReservations.forEach(reservation => {
			try {
				const reservationData = reservation.toJSON();
				
				
				if (!reservationData.checkOut) {
					console.warn(`[Hotel][REFRESH_AVAILABILITY][WARNING] Reserva ${reservationData.Id} sin checkOut, se omite`);
					return;
				}
				
				
				const reservationStatus = reservationData.status || 'active';
				if (reservationStatus === 'active') {
				
					let checkOutDate;
					try {
						
						if (typeof reservationData.checkOut === 'string') {
							checkOutDate = new Date(reservationData.checkOut);
						} else {
							checkOutDate = new Date(reservationData.checkOut);
						}
						
						if (isNaN(checkOutDate.getTime())) {
							console.warn(`[Hotel][REFRESH_AVAILABILITY][WARNING] Reserva ${reservationData.Id} con checkOut inválido: ${reservationData.checkOut}`);
							return;
						}
						
						checkOutDate.setHours(0, 0, 0, 0);
						const checkOutString = checkOutDate.toISOString().split('T')[0];
						
						
						if (checkOutString >= todayString) {
							occupiedRooms.add(reservationData.room_Id);
							console.log(`[Hotel][REFRESH_AVAILABILITY][OCCUPIED] Habitación ${reservationData.room_Id} ocupada por reserva ${reservationData.Id} (checkOut: ${checkOutString})`);
						} else {
							console.log(`[Hotel][REFRESH_AVAILABILITY][EXPIRED] Habitación ${reservationData.room_Id} liberada - reserva ${reservationData.Id} expirada (checkOut: ${checkOutString} < ${todayString})`);
						}
					} catch (dateError) {
						console.warn(`[Hotel][REFRESH_AVAILABILITY][WARNING] Error al procesar fecha checkOut de reserva ${reservationData.Id}:`, dateError.message);
					}
				} else {
					console.log(`[Hotel][REFRESH_AVAILABILITY][CANCELLED] Habitación ${reservationData.room_Id} liberada - reserva ${reservationData.Id} cancelada (status: ${reservationData.status})`);
				}
			} catch (error) {
				console.warn(`[Hotel][REFRESH_AVAILABILITY][WARNING] Error al procesar reserva ${reservation?.Id || 'unknown'}:`, error.message);
			}
		});
		
		let updatedCount = 0;
		let availableCount = 0;
		let unavailableCount = 0;
		

		for (const room of rooms) {
			const shouldBeAvailable = !occupiedRooms.has(room.Id);
			
			if (room.Disponible !== shouldBeAvailable) {
				await Rooms.update(
					{ Disponible: shouldBeAvailable },
					{ where: { Id: room.Id } }
				);
				updatedCount++;
				console.log(`[Hotel][REFRESH_AVAILABILITY][UPDATED] Habitación ${room.Id} (RoomNo: ${room.RoomNo}) -> ${shouldBeAvailable ? 'Disponible' : 'No Disponible'}`);
			}
			
			if (shouldBeAvailable) {
				availableCount++;
			} else {
				unavailableCount++;
			}
		}
		
		console.log('[Hotel][REFRESH_AVAILABILITY][SUCCESS]', {
			totalRooms: rooms.length,
			updatedCount,
			availableCount,
			unavailableCount,
			occupiedRoomsCount: occupiedRooms.size,
			totalReservations: allReservations.length
		});
		
		res.json({
			success: true,
			data: {
				totalRooms: rooms.length,
				updatedCount,
				availableCount,
				unavailableCount,
				activeReservationsCount: occupiedRooms.size
			},
			message: `Disponibilidades actualizadas. ${updatedCount} habitaciones cambiaron de estado.`,
		});
	} catch (error) {
		console.error('[Hotel][REFRESH_AVAILABILITY][ERROR]', error);
		res.status(500).json({
			success: false,
			message: "Error interno del servidor al refrescar disponibilidades",
			error: error.message,
		});
	}
};