import { sequelize } from "./db.js";
import { Rooms } from "./models/rooms.js";


async function migrateTarifa() {
  console.log("🚀 Iniciando migración de tarifas...");
  
  try {
    
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida");

 
    const tableDescription = await sequelize.getQueryInterface().describeTable('Rooms');
    
    if (tableDescription.Tarifa) {
      console.log("⚠️  La columna 'Tarifa' ya existe. La migración ya fue ejecutada.");
      return;
    }

    console.log("📊 Migrando estructura de base de datos...");

   
    await sequelize.getQueryInterface().addColumn('Rooms', 'Tarifa', {
      type: sequelize.Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });

    console.log("✅ Columna 'Tarifa' agregada exitosamente");

   
    const rooms = await sequelize.query('SELECT * FROM Rooms', {
      type: sequelize.QueryTypes.SELECT
    });

    console.log(`📋 Procesando ${rooms.length} habitaciones...`);


    for (const room of rooms) {
      const tarifasExistentes = [
        parseFloat(room.TarifaSA) || 0,
        parseFloat(room.TarifaAD) || 0,
        parseFloat(room.TarifaMP) || 0,
        parseFloat(room.TarifaPC) || 0,
        parseFloat(room.TarifaAI) || 0
      ];

    
      const tarifasValidas = tarifasExistentes.filter(t => t > 0);
      const tarifaPromedio = tarifasValidas.length > 0 
        ? tarifasValidas.reduce((sum, t) => sum + t, 0) / tarifasValidas.length 
        : 100; 
   
      await sequelize.query(
        'UPDATE Rooms SET Tarifa = ? WHERE Id = ?',
        {
          replacements: [tarifaPromedio, room.Id],
          type: sequelize.QueryTypes.UPDATE
        }
      );

      console.log(`✅ Habitación ${room.Id}: Tarifa migrada a ${tarifaPromedio.toFixed(2)}`);
    }

    
    console.log("🗑️  Eliminando columnas de tarifas antiguas...");
    
    const columnasAntiguas = ['TarifaSA', 'TarifaAD', 'TarifaMP', 'TarifaPC', 'TarifaAI'];
    
    for (const columna of columnasAntiguas) {
      if (tableDescription[columna]) {
        await sequelize.getQueryInterface().removeColumn('Rooms', columna);
        console.log(`✅ Columna '${columna}' eliminada`);
      }
    }

    console.log("🎉 Migración completada exitosamente!");
    console.log("📝 Resumen:");
    console.log("   - Columna 'Tarifa' agregada");
    console.log("   - Datos migrados usando tarifa promedio");
    console.log("   - Columnas antiguas eliminadas");

  } catch (error) {
    console.error("❌ Error durante la migración:", error);
    throw error;
  }
}


async function revertMigration() {
  console.log("🔄 Revirtiendo migración...");
  
  try {

    const columnasAntiguas = [
      { name: 'TarifaSA', type: sequelize.Sequelize.DECIMAL(10, 2), allowNull: true },
      { name: 'TarifaAD', type: sequelize.Sequelize.DECIMAL(10, 2), allowNull: true },
      { name: 'TarifaMP', type: sequelize.Sequelize.DECIMAL(10, 2), allowNull: true },
      { name: 'TarifaPC', type: sequelize.Sequelize.DECIMAL(10, 2), allowNull: true },
      { name: 'TarifaAI', type: sequelize.Sequelize.DECIMAL(10, 2), allowNull: true }
    ];

    for (const columna of columnasAntiguas) {
      await sequelize.getQueryInterface().addColumn('Rooms', columna.name, columna);
      console.log(`✅ Columna '${columna.name}' restaurada`);
    }

   
    await sequelize.getQueryInterface().removeColumn('Rooms', 'Tarifa');
    console.log(`✅ Columna 'Tarifa' eliminada`);

    console.log("🎉 Migración revertida exitosamente!");

  } catch (error) {
    console.error("❌ Error al revertir migración:", error);
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  if (command === 'revert') {
    revertMigration()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    migrateTarifa()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

export { migrateTarifa, revertMigration };