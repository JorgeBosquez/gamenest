const express = require("express");
const router = express.Router();
const db = require("../database");

// ======================
// AGREGAR A FAVORITOS
// ======================
router.post("/add", (req, res) => {
    const { usuario_id, juego_id } = req.body;

    if (!usuario_id || !juego_id) {
        return res.status(400).json({
            error: "Datos incompletos",
        });
    }

    db.run(
        `
    INSERT INTO favoritos(usuario_id, juego_id)
    VALUES(?, ?)
    `,
        [usuario_id, juego_id],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(400).json({
                        error: "Este videojuego ya está en favoritos.",
                    });
                }

                return res.status(500).json({
                    error: "Error al agregar favorito.",
                });
            }

            res.json({
                message: "❤️ Agregado a favoritos.",
            });
        }
    );
});

// ======================
// OBTENER FAVORITOS
// ======================
router.get("/:usuario_id", (req, res) => {
    const { usuario_id } = req.params;

    db.all(
        `
    SELECT
     favoritos.id AS favorito_id,
     juegos.id AS juego_id,
     juegos.nombre,
     juegos.genero,
     juegos.precio,
     juegos.imagen,
     juegos.descripcion    
    FROM favoritos
    INNER JOIN juegos
      ON favoritos.juego_id = juegos.id
    WHERE favoritos.usuario_id = ?
    ORDER BY favoritos.fecha DESC
    `,
        [usuario_id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    error: "Error al obtener favoritos.",
                });
            }

            res.json(rows);
        }
    );
});

// ======================
// ELIMINAR FAVORITO
// ======================
router.delete("/remove/:id", (req, res) => {
    db.run(
        "DELETE FROM favoritos WHERE id = ?",
        [req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: "Error al eliminar favorito.",
                });
            }

            res.json({
                message: "Favorito eliminado.",
            });
        }
    );
});

module.exports = router;