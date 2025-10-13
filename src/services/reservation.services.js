import { Reservations } from "../models/reservation.js";
import { Rooms } from "../models/rooms.js";
import { User } from "../models/user.js";
import { sequelize } from "../db.js";

export const Reservation = async (req, res) => {
	try {
		const { dni, checkIn, checkOut, room_Id, comment } = req.body;

		const user = await User.findOne({
			where: {
				dni: dni,
			},
		});

		const roomOk = await Rooms.findOne({
			where: {
				Id: room_Id,
			},
		});
		console.log(roomOk.Id);

		const newReservation = await Reservations.create({
			user_Dni: user.dni,
			checkIn,
			checkOut,
			room_Id: roomOk.Id,
		});

		res.json({ message: "se ah creado su reserva" });
		await Rooms.update({ Disponible: false }, { where: { Id: room_Id } });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Error en el servidor" });
	}
};

export const deleteReservation = async (req, res) => {
	const t = await sequelize.transaction();

	try {
		const { id } = req.params;

		// Verificamos que el usuario esté autenticado
		const userEmail = req.user?.email;
		if (!userEmail) {
			await t.rollback();
			return res.status(401).json({ message: "Usuario no autenticado" });
		}

		// Buscamos la reserva
		const reservation = await Reservations.findByPk(id, { transaction: t });
		if (!reservation) {
			await t.rollback();
			return res.status(404).json({ message: "Reserva no encontrada" });
		}

		// Buscar la habitación asociada
		const room = await Rooms.findByPk(reservation.room_Id, { transaction: t });

		// Eliminamos la reserva
		await reservation.destroy({ transaction: t });

		// Marcamos la habitación como disponible nuevamente
		if (room) {
			room.disponible = true;
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
