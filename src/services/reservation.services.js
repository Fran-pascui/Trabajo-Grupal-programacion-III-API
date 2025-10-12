import { Reservations } from "../models/reservation.js";
import { Rooms } from "../models/rooms.js";
import { User } from "../models/user.js";

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

export const DeleteReservation = async (req, res) => {
	try {
		const { reservationId } = req.body;
	} catch {}
};
