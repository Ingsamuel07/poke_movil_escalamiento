const express = require("express");
const cors = require("cors");

const pokemonRoutes = require("./routes/pokemonRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", pokemonRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});