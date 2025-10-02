

import { migrateTarifa, revertMigration } from "./src/migrateTarifa.js";

async function main() {
  const command = process.argv[2];
  
  console.log("🏨 Migración de Base de Datos - Sistema de Tarifas");
  console.log("=" .repeat(50));
  
  try {
    if (command === 'revert') {
      console.log("🔄 Iniciando reversión de migración...");
      await revertMigration();
    } else {
      console.log("🚀 Iniciando migración de tarifas...");
      await migrateTarifa();
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