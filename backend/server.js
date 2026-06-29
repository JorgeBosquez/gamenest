
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const gamesRoutes = require("./routes/games.routes");
const cartRoutes = require("./routes/cart.routes");
const checkoutRoutes = require("./routes/checkout.routes");
const libraryRoutes = require("./routes/library.routes");
const favoritesRoutes = require("./routes/favorites.routes");
require("./database");
const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());
app.use("/api/favorites", favoritesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/library", libraryRoutes);
app.get("/", (req, res) => {
  res.send("Backend de GameNest funcionando");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});