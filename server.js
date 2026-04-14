require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

const entrevistaRoutes = require('./src/routes/entrevista.routes');

app.use('/entrevistas', entrevistaRoutes);

app.listen(3000, () => {
  console.log('server corriendo en http://localhost:3000');
});