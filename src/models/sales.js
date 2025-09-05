import { DataTypes, STRING } from "sequelize";
import { sequelize } from "../db.js";

export const Sales = sequelize.define(
	"Sales",
	{
		Id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		Start_Date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		End_Date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		Description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ timestamps: false }
);
