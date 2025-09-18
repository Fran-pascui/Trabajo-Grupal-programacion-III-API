import { DataTypes, STRING } from "sequelize";
import { sequelize } from "../db.js";

export const User = sequelize.define(
	"User",
	{
		Id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
		},
		Name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		Surname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		Dni: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
		},
		Cell: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		Email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		Password: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		Class: {
			type: STRING,
			defaultValue: "User",
		},
	},
	{ timestamps: false }
);
