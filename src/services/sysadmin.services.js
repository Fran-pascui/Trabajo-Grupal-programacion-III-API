import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

export const emailAdminSearch = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) return res.status(401).send({ message: "Email invalido" });

		const user = await User.findOne({
			where: {
				email,
			},
		});

		if (!user) return res.status(401).send({ message: "usuario no existente" });

		const secretKey = "hoteles-starligth";
		const typeUser = user.class;

		const token = jwt.sign({ email, typeUser }, secretKey, { expiresIn: "1h" });

		return res.json({
			token,
			user: {
				Id: user.id,
				name: user.name,
				dni: user.dni,
				surname: user.surname,
				email: user.email,
				active: user.active,
			},
		});
	} catch {
		return res.status(500).json({ message: "Error en el servidor" });
	}
};

export const updateRol = async (req, res) => {
	try {
		const { email, newRole } = req.body;

		if (!email || !newRole)
			return res.status(400).json({ error: "Faltan campos requeridos." });

		const user = await User.findOne({ where: { email } });
		if (!user) return res.status(404).json({ error: "Usuario no encontrado." });

		user.class = newRole;
		await user.save();

		return res.json({
			message: "Rol actualizado correctamente.",
			email: user.email,
			newRole: user.class,
		});
	} catch (error) {
		console.error("Error al actualizar rol:", error);
		return res.status(500).json({ error: "Error interno del servidor." });
	}
};

export const changeActive = async (req, res) => {
	try {
		const dni = req.params;
		console.log(dni);
		const user = await User.findByPk(req.params.dni);
		if (!user)
			return res.status(404).json({ message: `Usuario no encontrado ${dni}` });

		user.active = !user.active;
		await user.save();

		res.json({ message: "Estado actualizado", user });
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error al cambiar estado", error: err.message });
	}
};
