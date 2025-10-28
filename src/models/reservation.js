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
		user_Dni: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		checkIn: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		checkOut: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		room_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "active",
		},
	},
	{ timestamps: false }
);
