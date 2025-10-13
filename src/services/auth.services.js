import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email) return res.status(401).send({ message: "Email invalido" });

		if (!password)
			return res.status(401).send({ message: "Contraseña invalido" });

		const user = await User.findOne({
			where: {
				email,
			},
		});

		if (!user) return res.status(401).send({ message: "usuario no existente" });

		const comparison = await bcrypt.compare(password, user.password);

		if (!comparison)
			return res.status(401).send({ message: "Contraseña incorrecta" });

		const secretKey = "hoteles-starligth";
		const typeUser = user.class;

		const token = jwt.sign({ email, typeUser }, secretKey, { expiresIn: "1h" });

		return res.json({
			token,
			user: {
				id: user.id,
				name: user.name,
				surname: user.surname,
				email: user.email,
			},
		});
	} catch {
		console.error("Error en login:", error);
		return res.status(500).json({ message: "Error en el servidor" });
	}
};

export const register = async (req, res) => {
	try {
		const { name, surname, dni, cellNumber, email, password } = req.body;

		const user = await User.findOne({
			where: {
				email,
			},
		});

		if (user) return res.status(400).send({ message: "Usuario existente" });

		const saltRounds = 10;

		const salt = await bcrypt.genSalt(saltRounds);

		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = await User.create({
			name,
			surname,
			dni,
			cellNumber,
			email,
			password: hashedPassword,
		});

		res.json({ message: `El usuario ${name} se ha registrado correctamente.` });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Error en el servidor" });
	}
};
