const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const reservationRoutes = require('./routes/reservations');
const indexRoutes = require('./routes/index');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Usar as rotas
app.use('/', indexRoutes);
app.use('/', reservationRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
