import { migrateReservations, revertReservationsMigration } from "./src/migrateReservations.js";

async function main() {
  const command = process.argv[2];
  
  console.log("🏨 Migración de Base de Datos - Tabla Reservations");
  console.log("=" .repeat(50));
  
  try {
    if (command === 'revert') {
      console.log("🔄 Iniciando reversión de migración...");
      await revertReservationsMigration();
    } else {
      console.log("🚀 Iniciando migración de reservaciones...");
      await migrateReservations();
    }
    
    console.log("✅ Proceso completado exitosamente");
  } catch (error) {
    console.error("❌ Error en el proceso:", error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}
main();