const express = require("express");
const router = express.Router();
const db = require("../database");

// FINALIZAR COMPRA
router.post("/", (req, res) => {
  const { usuario_id, metodo_pago } = req.body;

  if (!usuario_id || !metodo_pago) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  const queryCarrito = `
    SELECT 
      carrito.juego_id,
      carrito.cantidad,
      juegos.precio
    FROM carrito
    INNER JOIN juegos ON carrito.juego_id = juegos.id
    WHERE carrito.usuario_id = ?
  `;

  db.all(queryCarrito, [usuario_id], (err, items) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener carrito" });
    }

    if (items.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    const total = items.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );

    db.run(
      "INSERT INTO compras (usuario_id, total) VALUES (?, ?)",
      [usuario_id, total],
      function (err) {
        if (err) {
          return res.status(500).json({ error: "Error al registrar compra" });
        }

        const compraId = this.lastID;

        const insertDetalle = `
          INSERT INTO detalle_compras 
          (compra_id, juego_id, cantidad, precio_unitario)
          VALUES (?, ?, ?, ?)
        `;

        items.forEach((item) => {
          db.run(insertDetalle, [
            compraId,
            item.juego_id,
            item.cantidad,
            item.precio,
          ]);
        });

        db.run("DELETE FROM carrito WHERE usuario_id = ?", [usuario_id]);

        res.json({
          message: "Compra realizada correctamente",
          compra_id: compraId,
          total,
          metodo_pago,
        });
      }
    );
  });
});

module.exports = router;