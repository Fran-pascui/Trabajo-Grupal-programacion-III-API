
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
  1: { SA: 50, AD: 65, MP: 90, PC: 120, AI: 150 },
  2: { SA: 80, AD: 100, MP: 130, PC: 160, AI: 200 },
  3: { SA: 120, AD: 150, MP: 180, PC: 220, AI: 260 },
  4: { SA: 70, AD: 90, MP: 120, PC: 150, AI: 180 },
  5: { SA: 90, AD: 110, MP: 140, PC: 180, AI: 220 },
  6: { SA: 140, AD: 170, MP: 210, PC: 250, AI: 300 },
};


const amenitys = {
  1: ["WiFi gratuito", "Desayuno incluido", "Aire acondicionado", "Televisión", "Baño privado", "Caja fuerte", "Minibar", "Servicio de limpieza"],
  2: ["WiFi gratuito", "Aire acondicionado", "Televisión", "Baño privado", "Caja fuerte", "Minibar", "Servicio de limpieza"],
  3: ["WiFi gratuito", "Desayuno incluido", "Aire acondicionado", "Televisión", "Baño privado", "Caja fuerte", "Servicio de limpieza"],
  4: ["WiFi gratuito", "Aire acondicionado", "Televisión", "Baño privado", "Caja fuerte", "Minibar", "Servicio de limpieza"],
  5: ["WiFi gratuito", "Desayuno incluido", "Aire acondicionado", "Televisión", "Baño privado", "Caja fuerte"],
  6: ["WiFi gratuito", "Desayuno incluido", "Aire acondicionado", "Televisión", "Baño privado", "Caja fuerte", "Minibar"],
};


export async function initDatabase() {
  try {
   
    await sequelize.sync({ force: true });
    console.log("Base de datos sincronizada correctamente");

    
    for (const habitacion of habitaciones) {
      const tarifa = tarifas[habitacion.id];
      const amenities = amenitys[habitacion.id];
      const imagen = imagenes[habitacion.id];

      await Rooms.create({
        RoomNo: habitacion.id,
        Nombre: habitacion.nombre,
        Personas: habitacion.personas,
        Capacidad: habitacion.capacidad,
        Tipo: habitacion.tipo,
        Texto: habitacion.texto,
        Area: habitacion.area,
        Imagen: imagen,
        TarifaSA: tarifa.SA,
        TarifaAD: tarifa.AD,
        TarifaMP: tarifa.MP,
        TarifaPC: tarifa.PC,
        TarifaAI: tarifa.AI,
        Amenities: JSON.stringify(amenities),
        Disponible: true,
      });
    }

    console.log("Datos de habitaciones insertados correctamente");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  }
}


export async function closeDatabase() {
  try {
    await sequelize.close();
    console.log("Conexión a la base de datos cerrada");
  } catch (error) {
    console.error("Error al cerrar la conexión:", error);
  }
}