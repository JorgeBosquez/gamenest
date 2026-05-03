const express = require("express");
const router = express.Router();
const db = require("../database");
const bcrypt = require("bcryptjs");

// ======================
// REGISTRO (HU1)
// ======================
router.post("/register", (req, res) => {
  const { nombre, correo, password } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!correoRegex.test(correo)) {
    return res.status(400).json({ error: "El correo electrónico no es válido" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `
    INSERT INTO usuarios (nombre, correo, password)
    VALUES (?, ?, ?)
  `;

  db.run(query, [nombre, correo, hashedPassword], function (err) {
    if (err) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    res.json({
      message: "Usuario registrado correctamente",
      id: this.lastID,
    });
  });
});

// ======================
// LOGIN (HU2)
// ======================
router.post("/login", (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: "Campos obligatorios" });
  }

  const query = `SELECT * FROM usuarios WHERE correo = ?`;

  db.get(query, [correo], (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    res.json({
      message: "Login exitoso",
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
      },
    });
  });
});

// ======================
// VER USUARIOS REGISTRADOS
// Vista elegante solo para pruebas del Sprint 1
// ======================
router.get("/users", (req, res) => {
  const query = `SELECT id, nombre, correo FROM usuarios`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).send("Error al obtener usuarios");
    }

    const usuariosHTML = rows
      .map(
        (user) => `
          <tr>
            <td>${user.id}</td>
            <td>${user.nombre}</td>
            <td>${user.correo}</td>
          </tr>
        `
      )
      .join("");

    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Usuarios registrados - GameNest</title>
        <style>
          body {
            margin: 0;
            min-height: 100vh;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #070711, #1f0b3d);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .container {
            width: 85%;
            max-width: 900px;
            padding: 35px;
            border-radius: 20px;
            background: rgba(15, 15, 35, 0.9);
            border: 1px solid rgba(168, 85, 247, 0.4);
            box-shadow: 0 0 35px rgba(168, 85, 247, 0.25);
          }

          h1 {
            text-align: center;
            color: #c084fc;
            margin-bottom: 8px;
          }

          p {
            text-align: center;
            color: #cfc7e8;
            margin-bottom: 30px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            overflow: hidden;
            border-radius: 14px;
          }

          th {
            background: linear-gradient(135deg, #a855f7, #6d28d9);
            padding: 16px;
            text-align: left;
          }

          td {
            padding: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            color: #e8e3f5;
          }

          tr:hover {
            background: rgba(168, 85, 247, 0.12);
          }

          .badge {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 14px;
            border-radius: 999px;
            background: rgba(168, 85, 247, 0.18);
            color: #d8b4fe;
            font-weight: bold;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <h1>Usuarios registrados</h1>
          <p>Listado de cuentas creadas en GameNest</p>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
              </tr>
            </thead>
            <tbody>
              ${
                usuariosHTML ||
                `<tr><td colspan="3" style="text-align:center;">No hay usuarios registrados</td></tr>`
              }
            </tbody>
          </table>

          <div class="badge">Total de usuarios: ${rows.length}</div>
        </div>
      </body>
      </html>
    `);
  });
});
module.exports = router;