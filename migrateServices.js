import { sequelize } from "./src/db.js";
import { Services } from "./src/models/services.js";

async function migrateServices() {
	try {
		// Sincronizar el modelo con la base de datos (crear la tabla)
		await Services.sync({ force: true });
		console.log("✅ Tabla 'services' creada exitosamente");

		// Datos de servicios existentes del componente React
		const servicesData = [
			{
				title: "Restaurante",
				description: "Alta cocina internacional con vista panorámica.",
				icon: "FaUtensils",
				img: "https://ik.imagekit.io/rooxjlwlq/intercontinental-buenos-aires-3613454368-2x1.jpeg?updatedAt=1759175197436",
				isActive: true,
			},
			{
				title: "Gimnasio",
				description: "Equipado con la última tecnología fitness.",
				icon: "FaDumbbell",
				img: "https://ik.imagekit.io/rooxjlwlq/24-hours-gym-r0lg4mkl4m.jpeg?updatedAt=1759175524156",
				isActive: true,
			},
			{
				title: "Spa",
				description: "Masajes y tratamientos relajantes.",
				icon: "FaSpa",
				img: "https://ik.imagekit.io/rooxjlwlq/Industry_Spa_Software_Fresha.b66df7eb.avif?updatedAt=1759175940203",
				isActive: true,
			},
			{
				title: "Pileta",
				description: "Piscina climatizada con vista panorámica.",
				icon: "FaSwimmer",
				img: "https://ik.imagekit.io/rooxjlwlq/Spa-InterContinental-Buenos-Aires-Pileta-3.jpg?updatedAt=1759175290150",
				isActive: true,
			},
			{
				title: "Lavandería",
				description: "Servicio de lavado y planchado en el día.",
				icon: "FaTshirt",
				img: "https://ik.imagekit.io/rooxjlwlq/washwoman-mayor-en-el-lavadero-109389985.webp?updatedAt=1760325067641",
				isActive: true,
			},
			{
				title: "Centro de Convenciones",
				description: "Salones modulares con equipamiento audiovisual.",
				icon: "FaBuilding",
				img: "https://ik.imagekit.io/rooxjlwlq/1-5.jpg?updatedAt=1760325202895",
				isActive: true,
			},
		];

		// Insertar los servicios en la base de datos
		for (const service of servicesData) {
			await Services.create(service);
			console.log(`✅ Servicio '${service.title}' migrado exitosamente`);
		}

		console.log("🎉 Migración de servicios completada exitosamente");
		console.log(`📊 Total de servicios migrados: ${servicesData.length}`);

	} catch (error) {
		console.error("❌ Error durante la migración de servicios:", error);
	} finally {
		// Cerrar la conexión a la base de datos
		await sequelize.close();
		console.log("🔌 Conexión a la base de datos cerrada");
	}
}

// Ejecutar la migración
migrateServices();