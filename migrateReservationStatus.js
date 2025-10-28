import { sequelize } from "./src/db.js";
import { Reservations } from "./src/models/reservation.js";

async function migrateReservationStatus() {
  console.log("🚀 Iniciando migración de columna status en Reservations...");

  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida");

    const tableDescription = await sequelize
      .getQueryInterface()
      .describeTable("Reservations");
    console.log("📊 Estructura actual de la tabla Reservations:");
    console.log(Object.keys(tableDescription));

    if (tableDescription.status) {
      console.log("✅ La columna 'status' ya existe");
    } else {
      console.log("📝 Agregando columna 'status'...");

      await sequelize.getQueryInterface().addColumn("Reservations", "status", {
        type: sequelize.Sequelize.STRING,
        allowNull: true,
        defaultValue: "active",
      });

      console.log("✅ Columna 'status' agregada exitosamente");
    }

    console.log("📥 Obteniendo todas las reservas...");
    const reservations = await sequelize.query("SELECT * FROM Reservations", {
      type: sequelize.QueryTypes.SELECT,
    });

    console.log(`📊 Total de reservas encontradas: ${reservations.length}`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let updatedCount = 0;
    let activeCount = 0;
    let expiredCount = 0;

    for (const reservation of reservations) {
      const checkOutDate = new Date(reservation.checkOut);
      checkOutDate.setHours(0, 0, 0, 0);

      let newStatus;
      if (checkOutDate < today) {
        newStatus = "expired";
        expiredCount++;
      } else {
        newStatus = "active";
        activeCount++;
      }

      if (!reservation.status || reservation.status !== newStatus) {
        await sequelize.query(
          `UPDATE Reservations SET status = '${newStatus}' WHERE Id = ${reservation.Id}`,
          { type: sequelize.QueryTypes.UPDATE }
        );
        updatedCount++;
      }
    }

    console.log(`✅ Migración completada:`);
    console.log(`   - Total de reservas procesadas: ${reservations.length}`);
    console.log(`   - Reservas actualizadas: ${updatedCount}`);
    console.log(`   - Reservas activas: ${activeCount}`);
    console.log(`   - Reservas no vigentes: ${expiredCount}`);

    console.log("✨ ¡Migración exitosa!");
  } catch (error) {
    console.error("❌ Error durante la migración:", error);
    throw error;
  } finally {
    await sequelize.close();
    console.log("🔌 Conexión a la base de datos cerrada");
  }
}

migrateReservationStatus()
  .then(() => {
    console.log("🎉 Proceso de migración finalizado correctamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Error fatal en la migración:", error);
    process.exit(1);
  });
