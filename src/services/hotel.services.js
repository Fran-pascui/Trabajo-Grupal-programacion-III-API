import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

import { User } from "../models/user.js";
import { Rooms } from "../models/rooms.js";
import { Reservations } from "../models/reservation.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  const resultEmail = email;
  if (!resultEmail) return res.status(401).send({ message: "Email invalido" });
  const resultPassword = password;
  if (!resultPassword)
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

  const token = jwt.sign({ email }, secretKey, { expiresIn: "1h" });

  return res.json(token);
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

export const createRoom = async (req, res) => {
  console.log("🚀 RUTA POST /rooms EJECUTÁNDOSE");
  console.log("📥 Datos recibidos:", req.body);

  try {
    const roomData = req.body;
    const newRoom = await Rooms.create(roomData);

    console.log("✅ Habitación creada:", newRoom);

    res.status(201).json({
      success: true,
      data: newRoom,
      message: "Room creado exitosamente",
    });
  } catch (error) {
    console.error("❌ Error al crear room:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const roomData = req.body;

    const [updatedRowsCount] = await Rooms.update(roomData, {
      where: { Id: id },
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Room no encontrado",
      });
    }

    const updatedRoom = await Rooms.findByPk(id);

    res.json({
      success: true,
      data: updatedRoom,
      message: "Room actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar room:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const { tipo, capacidad } = req.query;
    let whereClause = {};

    if (tipo) {
      whereClause.Tipo = tipo;
    }

    if (capacidad) {
      whereClause.Capacidad = capacidad;
    }

    const rooms = await Rooms.findAll({
      where: whereClause,
    });

    res.json({
      success: true,
      data: rooms,
      message: "Rooms obtenidos exitosamente",
    });
  } catch (error) {
    console.error("Error al obtener rooms:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Rooms.findByPk(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room no encontrado",
      });
    }

    res.json({
      success: true,
      data: room,
      message: "Room obtenido exitosamente",
    });
  } catch (error) {
    console.error("Error al obtener room:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRowsCount = await Rooms.destroy({
      where: { Id: id },
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Room no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Room eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar room:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const checkRoomAvailability = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, cantidadHabitaciones, cantidadPersonas } =
      req.query;

    if (
      !fechaInicio ||
      !fechaFin ||
      !cantidadHabitaciones ||
      !cantidadPersonas
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Faltan parámetros requeridos: fechaInicio, fechaFin, cantidadHabitaciones, cantidadPersonas",
      });
    }

    const fechaInicioDB = new Date(fechaInicio).toISOString().split("T")[0];
    const fechaFinDB = new Date(fechaFin).toISOString().split("T")[0];

    const habitacionesDisponibles = await Rooms.findAll({
      where: {
        Disponible: true,
        Personas: {
          [Op.gte]: cantidadPersonas,
        },
      },
    });

    if (habitacionesDisponibles.length < cantidadHabitaciones) {
      return res.json({
        success: true,
        data: {
          disponible: false,
          habitacionesDisponibles: habitacionesDisponibles.length,
          habitacionesRequeridas: parseInt(cantidadHabitaciones),
          mensaje:
            "No hay suficientes habitaciones disponibles para la capacidad solicitada",
        },
        message: "Consulta de disponibilidad completada",
      });
    }

    const reservasExistentes = await Reservations.findAll({
      where: {
        Reservation_date: {
          [Op.gte]: fechaInicioDB,
        },
      },
    });

    const reservasSuperpuestas = reservasExistentes.filter((reserva) => {
      const fechaReserva = new Date(reserva.Reservation_date);
      const fechaFinReserva = new Date(fechaReserva);
      fechaFinReserva.setDate(fechaFinReserva.getDate() + reserva.days - 1);

      return (
        fechaReserva <= new Date(fechaFinDB) &&
        fechaFinReserva >= new Date(fechaInicioDB)
      );
    });

    const habitacionesReservadas = reservasSuperpuestas.map(
      (reserva) => reserva.room_Id
    );

    const habitacionesRealmenteDisponibles = habitacionesDisponibles.filter(
      (habitacion) => !habitacionesReservadas.includes(habitacion.Id)
    );

    const hayDisponibilidad =
      habitacionesRealmenteDisponibles.length >= parseInt(cantidadHabitaciones);

    res.json({
      success: true,
      data: {
        disponible: hayDisponibilidad,
        habitacionesDisponibles: habitacionesRealmenteDisponibles.length,
        habitacionesRequeridas: parseInt(cantidadHabitaciones),
        fechaInicio: fechaInicioDB,
        fechaFin: fechaFinDB,
        habitaciones: habitacionesRealmenteDisponibles.slice(
          0,
          parseInt(cantidadHabitaciones)
        ),
        mensaje: hayDisponibilidad
          ? "Habitaciones disponibles para las fechas solicitadas"
          : "No hay habitaciones disponibles para las fechas solicitadas",
      },
      message: "Consulta de disponibilidad completada",
    });
  } catch (error) {
    console.error("Error al verificar disponibilidad:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};
