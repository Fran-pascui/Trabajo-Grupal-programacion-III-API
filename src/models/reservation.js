import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Reservations = sequelize.define(
	"Reservations",
	{
		Id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		Reservation_date: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		user_Dni: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		room_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		days: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{ timestamps: false }
);