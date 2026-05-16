const express = require("express");
const router = express.Router();
const db = require("../database");

// ======================
// OBTENER TODOS LOS JUEGOS
// ======================

router.get("/", (req, res) => {
  const query = "SELECT * FROM juegos";

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: "Error al obtener videojuegos"
      });
    }

    res.json(rows);
  });
});

module.exports = router;