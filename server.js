const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

// Cargar "base de datos"
let db = JSON.parse(fs.readFileSync("db.json"));

// Función para calcular fecha de corte (suma 1 mes)
function calcularFechaCorte(fechaContratacion) {
  const fecha = new Date(fechaContratacion);
  fecha.setMonth(fecha.getMonth() + 1); // sumar 1 mes
  // Ajustar formato YYYY-MM-DD
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Endpoint para estado de cuenta
app.post("/estado-cuenta", (req, res) => {
  const { cuenta } = req.body;

  if (!cuenta) {
    return res.status(400).json({ error: "Falta número de cuenta" });
  }

  const usuario = db.usuarios.find(u => u.cuenta === cuenta);

  if (!usuario) {
    return res.status(404).json({ error: "Cuenta no encontrada" });
  }

  // Calcular fecha de corte dinámica
  const fechaCorte = calcularFechaCorte(usuario.fecha_contratacion);

  res.json({
    mensaje: `Hola ${usuario.nombre}, tu saldo es $${usuario.saldo}\n` +
             `📅 Fecha de contratación: ${usuario.fecha_contratacion}\n` +
             `🔔 Fecha de corte: ${fechaCorte}`
  });
});

// Iniciar servidor en puerto dinámico (Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
