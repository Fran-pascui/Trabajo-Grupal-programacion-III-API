import { initDatabase, closeDatabase } from "./initDb.js";

async function main() {
	console.log("Iniciando creación de base de datos...");
	try {
		await initDatabase();
		console.log("Base de datos creada exitosamente con todas las habitaciones");
	} catch (error) {
		console.error("Error durante la creación de la base de datos:", error);
	} finally {
		await closeDatabase();
		process.exit(0);
	}
}

main();
