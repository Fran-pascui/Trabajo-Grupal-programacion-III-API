import { Reservations } from "../models/reservation.js";
import { Rooms } from "../models/rooms.js";
import { User } from "../models/user.js";
import { sequelize } from "../db.js";

export const Reservation = async (req, res) => {
	try {
		const { email, checkIn, checkOut, room_Id, guest, comment } = req.body;
		console.log('[Reservation][CREATE][REQ]', { email, checkIn, checkOut, room_Id, guest, comment });

		const user = await User.findOne({
			where: {
				email: email,
			},
		});
		console.log('[Reservation][CREATE][USER]', user?.dni, user?.email);

		const roomOk = await Rooms.findOne({
			where: {
				Id: room_Id,
			},
		});
		console.log('[Reservation][CREATE][ROOM]', roomOk?.Id, roomOk?.Disponible);
		const newReservation = await Reservations.create({
			user_Dni: user.dni,
			checkIn,
			checkOut,
			room_Id: roomOk.Id,
		});
		console.log('[Reservation][CREATE][DONE]', newReservation?.Id);

		await Rooms.update({ Disponible: false }, { where: { Id: room_Id } });
		console.log('[Reservation][ROOM][SET_UNAVAILABLE]', room_Id);
		res.json({ message: "se ah creado su reserva" });
	} catch (err) {
		console.error('[Reservation][CREATE][ERROR]', err);
		return res.status(500).json({ message: "Error en el servidor" });
	}
};

export const deleteReservation = async (req, res) => {
    const t = await sequelize.transaction();

	try {
		const { id } = req.params;

		
		const userEmail = req.user?.email;
		if (!userEmail) {
			await t.rollback();
			return res.status(401).json({ message: "Usuario no autenticado" });
		}

		
		const reservation = await Reservations.findByPk(id, { transaction: t });
		if (!reservation) {
			await t.rollback();
			return res.status(404).json({ message: "Reserva no encontrada" });
		}

		const room = await Rooms.findByPk(reservation.room_Id, { transaction: t });

		
		await reservation.destroy({ transaction: t });

		
        if (room) {
            room.Disponible = true;
            await room.save({ transaction: t });
        }

		await t.commit();
		return res.status(200).json({
			message: "Reserva eliminada correctamente",
			deletedId: id,
			user: userEmail,
		});
	} catch (error) {
		await t.rollback();
		console.error("Error al eliminar reserva:", error);
		return res.status(500).json({ message: "Error interno del servidor" });
	}
};
export const getAllReservations = async (req, res) => {
	try {
		console.log('[Reservation][GET_ALL][REQUEST]', { 
			userType: req.user?.typeUser,
			userEmail: req.user?.email 
		});

		
		if (req.user?.typeUser !== 'admin' && req.user?.typeUser !== 'sysadmin') {
			console.log('[Reservation][GET_ALL][PERMISSION_DENIED]', 'Usuario no autorizado');
			return res.status(403).json({
				success: false,
				message: 'No tienes permisos para ver todas las reservas'
			});
		}

		console.log('[Reservation][GET_ALL][FETCHING]', 'Obteniendo todas las reservas');
		
		const reservations = await Reservations.findAll({
			include: [
				{
					model: Rooms,
					attributes: ['Id', 'Nombre', 'Tipo', 'Tarifa', 'RoomNo']
				},
				{
					model: User,
					attributes: ['dni', 'name', 'surname', 'email', 'cellNumber']
				}
			],
			order: [['Id', 'DESC']]
		});

		console.log('[Reservation][GET_ALL][RESULT_COUNT]', reservations?.length);

		res.json({
			success: true,
			data: reservations,
			message: 'Todas las reservas obtenidas exitosamente'
		});

	} catch (error) {
		console.error('[Reservation][GET_ALL][ERROR]', error);
		res.status(500).json({
			success: false,
			message: 'Error interno del servidor',
			error: error.message
		});
	}
};