
import sqlite3pkg from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const sqlite3 = sqlite3pkg.verbose();

// Obtener __dirname equivalente en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta absoluta al archivo hotel.db
const dbPath = path.join(__dirname, "hotel.db");

// Conexión a la base
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Error al conectar con la base de datos:", err.message);
    process.exit(1);
  }
  console.log("✅ Conectado a la base de datos hotel.db");
});


db.all("PRAGMA table_info(Users)", (err, columns) => {
  if (err) {
    console.error("❌ Error al leer estructura de la tabla:", err.message);
    return;
  }

  const columnExists = columns.some((col) => col.name === "active");

  if (columnExists) {
    console.log("ℹ️ La columna 'active' ya existe en la tabla Users.");
    db.close();
  } else {
    const query = 'ALTER TABLE Users ADD COLUMN active BOOLEAN DEFAULT 1;';
    db.run(query, (err) => {
      if (err) {
        console.error("❌ Error al agregar la columna:", err.message);
      } else {
        console.log("✅ Columna 'active' agregada correctamente a la tabla Users.");
      }
      db.close();
    });
  }
});
