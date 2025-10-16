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
				surname: user.surname,
				email: user.email,
			},
		});
	} catch {
		return res.status(500).json({ message: "Error en el servidor" });
	}
};
