import { sequelize } from "./db.js";
import { Rooms } from "./models/rooms.js";

const habitaciones = [
	{
		id: 1,
		nombre: "Habitación Deluxe Single",
		personas: 1,
		capacidad: "Single",
		tipo: "Deluxe",
		texto: "Ideal para viajeros solos, equipada con todas las comodidades.",
		area: "25 m²",
	},
	{
		id: 2,
		nombre: "Habitación Suite Twin",
		personas: 2,
		capacidad: "Twin",
		tipo: "Suite",
		texto: "Perfecta para dos personas, con dos camas y espacio cómodo.",
		area: "35 m²",
	},
	{
		id: 3,
		nombre: "Habitación Deluxe Triple",
		personas: 3,
		capacidad: "Triple",
		tipo: "Deluxe",
		texto: "Con capacidad para tres, ideal para familias o amigos.",
		area: "40 m²",
	},
	{
		id: 4,
		nombre: "Habitación Suite Single",
		personas: 1,
		capacidad: "Single",
		tipo: "Suite",
		texto: "Una suite individual de lujo, para máxima comodidad.",
		area: "28 m²",
	},
	{
		id: 5,
		nombre: "Habitación Deluxe Twin",
		personas: 2,
		capacidad: "Twin",
		tipo: "Deluxe",
		texto: "Habitación elegante para dos personas, con estilo moderno.",
		area: "32 m²",
	},
	{
		id: 6,
		nombre: "Habitación Suite Triple",
		personas: 3,
		capacidad: "Triple",
		tipo: "Suite",
		texto: "Amplia suite para grupos de tres, con todas las comodidades.",
		area: "45 m²",
	},
];

const imagenes = {
	1: "https://picsum.photos/400/200?random=1",
	2: "https://picsum.photos/400/200?random=2",
	3: "https://picsum.photos/400/200?random=3",
	4: "https://picsum.photos/400/200?random=4",
	5: "https://picsum.photos/400/200?random=5",
	6: "https://picsum.photos/400/200?random=6",
};

const tarifas = {
	1: 75000,
	2: 125000,
	3: 180000,
	4: 100000,
	5: 135000,
	6: 200000,
};

const amenitys = {
	1: [
		"WiFi gratuito",
		"Desayuno incluido",
		"Aire acondicionado",
		"Televisión",
		"Baño privado",
		"Caja fuerte",
		"Minibar",
		"Servicio de limpieza",
	],
	2: [
		"WiFi gratuito",
		"Aire acondicionado",
		"Televisión",
		"Baño privado",
		"Caja fuerte",
		"Minibar",
		"Servicio de limpieza",
	],
	3: [
		"WiFi gratuito",
		"Desayuno incluido",
		"Aire acondicionado",
		"Televisión",
		"Baño privado",
		"Caja fuerte",
		"Servicio de limpieza",
	],
	4: [
		"WiFi gratuito",
		"Aire acondicionado",
		"Televisión",
		"Baño privado",
		"Caja fuerte",
		"Minibar",
		"Servicio de limpieza",
	],
	5: [
		"WiFi gratuito",
		"Desayuno incluido",
		"Aire acondicionado",
		"Televisión",
		"Baño privado",
		"Caja fuerte",
	],
	6: [
		"WiFi gratuito",
		"Desayuno incluido",
		"Aire acondicionado",
		"Televisión",
		"Baño privado",
		"Caja fuerte",
		"Minibar",
	],
};

export async function initDatabase() {
	try {
		await sequelize.sync({ force: true });
		console.log("✅ Base de datos sincronizada correctamente");

		for (const habitacion of habitaciones) {
			await Rooms.create({
				RoomNo: habitacion.id,
				Nombre: habitacion.nombre,
				Personas: habitacion.personas,
				Capacidad: habitacion.capacidad,
				Tipo: habitacion.tipo,
				Texto: habitacion.texto,
				Area: habitacion.area,
				Imagen: imagenes[habitacion.id],
				Tarifa: tarifas[habitacion.id],
				Amenities: JSON.stringify(amenitys[habitacion.id]),
				Disponible: true,
			});
		}

		console.log("✅ Datos de habitaciones insertados correctamente");
	} catch (error) {
		console.error("❌ Error al inicializar la base de datos:", error);
	}
}

export async function closeDatabase() {
	try {
		await sequelize.close();
		console.log("🔒 Conexión a la base de datos cerrada");
	} catch (error) {
		console.error("❌ Error al cerrar la conexión:", error);
	}
}
