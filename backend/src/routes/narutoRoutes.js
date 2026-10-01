const express = require("express");
const router = express.Router();

const {
  obtenerPersonaje,
  listarPopulares,
} = require("../controllers/narutoController");

router.get("/naruto", listarPopulares);
router.get("/naruto/:nombre", obtenerPersonaje);

module.exports = router;
