import { DataTypes, STRING } from "sequelize";
import { sequelize } from "../db.js";

export const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		surname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		dni: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
		},
		cellNumber: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		class: {
			type: STRING,
			defaultValue: "User",
		},
	},
	{ timestamps: false }
);
