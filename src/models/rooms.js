import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Rooms = sequelize.define(
	"Rooms",
	{
		Id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		RoomNo: { 
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		Nombre: {  
			type: DataTypes.STRING,
			allowNull: false,
		},
		Personas: { 
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		Capacidad: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		Tipo: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		Texto: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		Area: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		Imagen: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		Tarifa: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		Amenities: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		Disponible: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: true,
		},
	},
	{ timestamps: false }
);