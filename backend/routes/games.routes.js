const express = require("express");
const router = express.Router();
const db = require("../database");

// ======================
// LISTAR VIDEOJUEGOS
// ======================
router.get("/", (req, res) => {
  db.all("SELECT * FROM juegos ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener videojuegos" });
    }

    res.json(rows);
  });
});

// ======================
// CREAR VIDEOJUEGO
// ======================
router.post("/", (req, res) => {
  const { nombre, genero, precio, imagen, descripcion } = req.body;

  if (!nombre || !genero || precio === "" || precio === null || precio === undefined) {
    return res.status(400).json({
      error: "Nombre, género y precio son obligatorios",
    });
  }

  if (isNaN(precio) || Number(precio) < 0) {
    return res.status(400).json({
      error: "El precio debe ser un número válido mayor o igual a 0",
    });
  }

  const query = `
    INSERT INTO juegos (nombre, genero, precio, imagen, descripcion)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [nombre, genero, Number(precio), imagen || "", descripcion || ""],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Error al crear videojuego" });
      }

      res.json({
        message: "Videojuego creado correctamente",
        id: this.lastID,
      });
    }
  );
});

// ======================
// ACTUALIZAR VIDEOJUEGO
// ======================
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, genero, precio, imagen, descripcion } = req.body;

  if (!nombre || !genero || precio === "" || precio === null || precio === undefined) {
    return res.status(400).json({
      error: "Nombre, género y precio son obligatorios",
    });
  }

  if (isNaN(precio) || Number(precio) < 0) {
    return res.status(400).json({
      error: "El precio debe ser un número válido mayor o igual a 0",
    });
  }

  const query = `
    UPDATE juegos
    SET nombre = ?, genero = ?, precio = ?, imagen = ?, descripcion = ?
    WHERE id = ?
  `;

  db.run(
    query,
    [nombre, genero, Number(precio), imagen || "", descripcion || "", id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Error al actualizar videojuego" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Videojuego no encontrado" });
      }

      res.json({ message: "Videojuego actualizado correctamente" });
    }
  );
});

// ======================
// ELIMINAR VIDEOJUEGO
// ======================
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM juegos WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Error al eliminar videojuego" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Videojuego no encontrado" });
    }

    res.json({ message: "Videojuego eliminado correctamente" });
  });
});

module.exports = router;