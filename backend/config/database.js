// backend/config/database.js
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

// Configurações de conexão
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  autoIndex: true,
  maxPoolSize: 10,
  socketTimeoutMS: 45000,
  family: 4
};

// Função para conectar ao MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, options);
    console.log('Conectado ao MongoDB com sucesso');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    // Tentar reconectar após um atraso
    setTimeout(connectDB, 5000);
  }
};

// Eventos de conexão
mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado ao banco de dados');
});

mongoose.connection.on('error', (err) => {
  console.error('Erro de conexão do Mongoose:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado do banco de dados');
});

// Desconexão limpa quando o processo terminar
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Conexão do Mongoose fechada devido ao encerramento do aplicativo');
  process.exit(0);
});

// Exportar a conexão
module.exports = {
  connectDB,
  mongoose
};