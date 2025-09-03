import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Reservations = sequelize.define(
	"Reservations",
	{
		Id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
		},
		Reservation_date: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		user_Dni: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		room_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{ timestamps: false }
);
