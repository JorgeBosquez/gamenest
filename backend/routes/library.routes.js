const express = require("express");
const router = express.Router();
const db = require("../database");

// OBTENER JUEGOS COMPRADOS POR USUARIO
router.get("/:usuario_id", (req, res) => {
    const { usuario_id } = req.params;

    const query = `
  SELECT 
    juegos.id AS juego_id,
    juegos.nombre,
    juegos.genero,
    juegos.precio,
    juegos.imagen,
    juegos.descripcion,
    MAX(compras.fecha) AS fecha,
    SUM(detalle_compras.cantidad) AS cantidad_total
  FROM detalle_compras
  INNER JOIN compras ON detalle_compras.compra_id = compras.id
  INNER JOIN juegos ON detalle_compras.juego_id = juegos.id
  WHERE compras.usuario_id = ?
  GROUP BY juegos.id
  ORDER BY fecha DESC
`;

    db.all(query, [usuario_id], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: "Error al obtener biblioteca de juegos",
            });
        }

        res.json(rows);
    });
});

module.exports = router;