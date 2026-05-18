const express = require("express");
const router = express.Router();
const db = require("../database");

// AGREGAR JUEGO AL CARRITO
router.post("/add", (req, res) => {
  const { usuario_id, juego_id } = req.body;

  if (!usuario_id || !juego_id) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  db.get(
    "SELECT * FROM carrito WHERE usuario_id = ? AND juego_id = ?",
    [usuario_id, juego_id],
    (err, item) => {
      if (err) return res.status(500).json({ error: "Error del servidor" });

      if (item) {
        db.run(
          "UPDATE carrito SET cantidad = cantidad + 1 WHERE id = ?",
          [item.id],
          () => res.json({ message: "Cantidad actualizada en el carrito" })
        );
      } else {
        db.run(
          "INSERT INTO carrito (usuario_id, juego_id, cantidad) VALUES (?, ?, 1)",
          [usuario_id, juego_id],
          () => res.json({ message: "Juego agregado al carrito" })
        );
      }
    }
  );
});

// VER CARRITO DEL USUARIO
router.get("/:usuario_id", (req, res) => {
  const { usuario_id } = req.params;

  const query = `
    SELECT 
      carrito.id,
      carrito.cantidad,
      juegos.id AS juego_id,
      juegos.nombre,
      juegos.genero,
      juegos.precio,
      juegos.imagen,
      juegos.descripcion
    FROM carrito
    INNER JOIN juegos ON carrito.juego_id = juegos.id
    WHERE carrito.usuario_id = ?
  `;

  db.all(query, [usuario_id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Error al obtener carrito" });

    res.json(rows);
  });
});

// ELIMINAR ITEM DEL CARRITO
router.delete("/remove/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM carrito WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: "Error al eliminar item" });

    res.json({ message: "Producto eliminado del carrito" });
  });
});

// VACIAR CARRITO
router.delete("/clear/:usuario_id", (req, res) => {
  const { usuario_id } = req.params;

  db.run("DELETE FROM carrito WHERE usuario_id = ?", [usuario_id], function (err) {
    if (err) return res.status(500).json({ error: "Error al vaciar carrito" });

    res.json({ message: "Carrito vaciado correctamente" });
  });
});

module.exports = router;