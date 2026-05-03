const sqlite3 = require("sqlite3").verbose();

// Crear o conectar a la base de datos
const db = new sqlite3.Database("./gamenest.db", (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos", err);
  } else {
    console.log("Base de datos SQLite conectada");
  }
});

// Crear tabla usuarios si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

module.exports = db;