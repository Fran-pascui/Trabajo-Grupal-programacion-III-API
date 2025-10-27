import { User } from "../models/user.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email) {
			return res.status(401).send({ message: "Email inválido" });
		}

		if (!password) {
			return res.status(401).send({ message: "Contraseña inválida" });
		}

		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(401).send({ message: "Usuario no existente" });
		}

		const comparison = await bcrypt.compare(password, user.password);

		if (!comparison) {
			return res.status(401).send({ message: "Contraseña incorrecta" });
		}

		const secretKey = "hoteles-starligth";
		const typeUser = user.class;

		const token = jwt.sign({ 
			email, 
			typeUser, 
			dni: user.dni 
		}, secretKey, { expiresIn: "1h" });

		return res.json({
			token,
			user: {
				dni: user.dni,
				name: user.name,
				surname: user.surname,
				email: user.email,
			},
		});
	} catch (error) { 
		console.error("Error en login:", error); 
		return res.status(500).json({ message: "Error en el servidor" });
	}
};

export const register = async (req, res) => {
	try {
		const { name, surname, dni, cellNumber, email, password } = req.body;

		const user = await User.findOne({ where: { email } });

		if (user) {
			return res.status(400).send({ message: "Este email ya está registrado" });
		}

		const saltRounds = 10;
		const salt = await bcrypt.genSalt(saltRounds);
		const hashedPassword = await bcrypt.hash(password, salt);

		await User.create({
			name,
			surname,
			dni,
			cellNumber,
			email,
			password: hashedPassword,
		});

		return res.json({ message: `El usuario ${name} se ha registrado correctamente.` });
	} catch (error) {
		console.error("Error en register:", error);
		return res.status(500).json({ message: "Error en el servidor" });
	}
};
