const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { PORT } = require('./backend/config/env');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
require('./backend/config/database');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware de segurança
app.use(helmet()); // Configurar cabeçalhos HTTP para segurança
app.use(compression()); // Compressão de resposta
app.use(cors()); // Configurar CORS

// Limitar solicitações para prevenir ataques de força bruta
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 solicitações por IP
  message: 'Muitas solicitações deste IP, tente novamente após 15 minutos'
});
app.use('/api/', apiLimiter);

// Rotas da API
app.use('/api', require('./backend/routes'));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'frontend')));

// Rota para a página inicial
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Tratamento de sinais para desligamento gracioso
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido, desligando graciosamente');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido, desligando graciosamente');
  process.exit(0);
});