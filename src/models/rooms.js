import { DataTypes, STRING } from "sequelize";
import { sequelize } from "../db.js";

export const Rooms = sequelize.define(
	"Rooms",
	{
		Id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		RooomNo: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		Type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		Avaliable: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: true,
		},
	},
	{ timestamps: false }
);
