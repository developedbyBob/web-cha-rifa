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

// Desativar CSP do Helmet para resolver problemas de fontes
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(compression());
app.use(cors());

// Limitar solicitações para prevenir ataques de força bruta
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas solicitações deste IP, tente novamente após 15 minutos'
});
app.use('/api/', apiLimiter);

// Para componentes JavaScript que estão em /frontend/components
app.use('/components', express.static(path.join(__dirname, 'frontend/components'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'application/javascript');
  }
}));

// Para arquivos CSS
app.use('/css', express.static(path.join(__dirname, 'frontend/css'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'text/css');
  }
}));

// Para arquivos JavaScript em /js
app.use('/js', express.static(path.join(__dirname, 'frontend/js'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'application/javascript');
  }
}));

app.use('/assets', express.static(path.join(__dirname, 'frontend/assets')));

// Rota para o Service Worker
app.get('/sw.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(path.resolve(__dirname, 'public', 'sw.js'));
});

// Servir arquivos da pasta public
app.use('/', express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api', require('./backend/routes'));

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