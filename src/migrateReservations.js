import { sequelize } from "./db.js";

async function migrateReservations() {
	console.log("🚀 Iniciando migración de tabla Reservations...");

	try {
		await sequelize.authenticate();
		console.log("✅ Conexión a la base de datos establecida");

		const tableDescription = await sequelize
			.getQueryInterface()
			.describeTable("Reservations");
		console.log("📊 Estructura actual de la tabla Reservations:");
		console.log(tableDescription);

		if (tableDescription.days) {
			console.log(
				"⚠️  La columna 'days' ya existe. Verificando si necesita modificación..."
			);
		} else {
			console.log("📝 Agregando columna 'days'...");

			await sequelize.getQueryInterface().addColumn("Reservations", "days", {
				type: sequelize.Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1,
			});

			console.log("✅ Columna 'days' agregada exitosamente");
		}

		if (tableDescription.user_Dni) {
			console.log(
				`📋 Tipo actual de user_Dni: ${tableDescription.user_Dni.type}`
			);

			if (tableDescription.user_Dni.type !== "INTEGER") {
				console.log("🔄 Modificando tipo de datos de user_Dni a INTEGER...");

				const reservations = await sequelize.query(
					"SELECT * FROM Reservations",
					{
						type: sequelize.QueryTypes.SELECT,
					}
				);

				console.log(`📊 Procesando ${reservations.length} reservaciones...`);

				await sequelize.getQueryInterface().createTable("Reservations_temp", {
					Id: {
						type: sequelize.Sequelize.INTEGER,
						primaryKey: true,
						autoIncrement: true,
					},
					Reservation_date: {
						type: sequelize.Sequelize.STRING,
						allowNull: false,
					},
					user_Dni: {
						type: sequelize.Sequelize.INTEGER,
						allowNull: false,
					},
					room_Id: {
						type: sequelize.Sequelize.INTEGER,
						allowNull: false,
					},
					days: {
						type: sequelize.Sequelize.INTEGER,
						allowNull: false,
						defaultValue: 1,
					},
				});

				for (const reservation of reservations) {
					await sequelize.query(
						`INSERT INTO Reservations_temp (Id, Reservation_date, user_Dni, room_Id, days)
             VALUES (?, ?, ?, ?, ?)`,
						{
							replacements: [
								reservation.Id,
								reservation.Reservation_date,

								typeof reservation.user_Dni === "string"
									? parseInt(reservation.user_Dni) || 0
									: reservation.user_Dni,
								reservation.room_Id,
								reservation.days || 1,
							],
							type: sequelize.QueryTypes.INSERT,
						}
					);
				}

				await sequelize.getQueryInterface().dropTable("Reservations");
				await sequelize
					.getQueryInterface()
					.renameTable("Reservations_temp", "Reservations");

				console.log("✅ Tipo de datos de user_Dni modificado a INTEGER");
			} else {
				console.log("✅ El tipo de datos de user_Dni ya es correcto (INTEGER)");
			}
		}

		console.log("🎉 Migración de Reservations completada exitosamente!");
		console.log("📝 Resumen:");
		console.log("   - Campo 'days' agregado/verificado");
		console.log(
			"   - Tipo de datos de 'user_Dni' verificado/modificado a INTEGER"
		);
	} catch (error) {
		console.error("❌ Error durante la migración:", error);
		throw error;
	}
}

async function revertReservationsMigration() {
	console.log("🔄 Revirtiendo migración de Reservations...");

	try {
		await sequelize.authenticate();
		console.log("✅ Conexión a la base de datos establecida");

		const tableDescription = await sequelize
			.getQueryInterface()
			.describeTable("Reservations");

		if (tableDescription.days) {
			await sequelize.getQueryInterface().removeColumn("Reservations", "days");
			console.log("✅ Columna 'days' eliminada");
		}

		console.log("🎉 Migración de Reservations revertida exitosamente!");
	} catch (error) {
		console.error("❌ Error al revertir migración:", error);
		throw error;
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const command = process.argv[2];

	if (command === "revert") {
		revertReservationsMigration()
			.then(() => process.exit(0))
			.catch(() => process.exit(1));
	} else {
		migrateReservations()
			.then(() => process.exit(0))
			.catch(() => process.exit(1));
	}
}

export { migrateReservations, revertReservationsMigration };
