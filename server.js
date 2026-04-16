require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Importamos cors

// --- PARCHE PARA BIGINT (PRISMA) ---
// Evita el error "Do not know how to serialize a BigInt" al enviar respuestas JSON
BigInt.prototype.toJSON = function() {
  return this.toString();
};

const app = express();

// --- CONFIGURACIÓN DE CORS ---
// Esto permite que tu Frontend (puerto 5173) envíe el Token de Authorization al Backend (puerto 3000)
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importación de rutas
const entrevistaRoutes = require('./src/routes/entrevista.routes');
const authRoutes = require('./src/routes/auth.routes');

// Definición de Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/entrevistas', entrevistaRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: "API de Entrevistas FENI - IPISA",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth/login",
      entrevistas: "/api/entrevistas"
    }
  });
});

const PORT = process.env.PORT || 3000;
console.log(process.env.JWT_SECRET)
app.listen(PORT, () => {
  console.log(`\n✅ Server corriendo en http://localhost:${PORT}`);
  console.log(`   Entrevistas → http://localhost:${PORT}/api/entrevistas`);
  console.log(`   Login       → http://localhost:${PORT}/api/auth/login\n`);
});