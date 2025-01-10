const mongoose = require('mongoose');

// Configure a conexão com o MongoDB
mongoose.connect('mongodb+srv://esdrassantos41:r4A0qY6riKYt1KeN@cha-rifa.ccuxn.mongodb.net/?retryWrites=true&w=majority&appName=cha-rifa')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(error => console.error('Erro ao conectar ao MongoDB:', error));

// Exportar a instância do Mongoose conectada
module.exports = mongoose;

