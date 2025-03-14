const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { PORT } = require('./backend/config/env');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const { connectDB } = require('./backend/config/database');

const app = express();

// Conectar ao banco de dados
connectDB().catch(err => console.error('Erro ao conectar ao banco de dados:', err));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar CSP para permitir recursos externos (como fontes do Google)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "mongodb.com", "mongodb.net", "*"],
        fontSrc: ["'self'", "fonts.googleapis.com", "fonts.gstatic.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        imgSrc: ["'self'", "data:"],
        scriptSrc: ["'self'", "'unsafe-inline'"]
      }
    }
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

// Servir arquivos estáticos diretamente da pasta frontend
// Para componentes JavaScript
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

// Para arquivos JavaScript
app.use('/js', express.static(path.join(__dirname, 'frontend/js'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'application/javascript');
  }
}));

// Para arquivos de assets (imagens, etc)
app.use('/assets', express.static(path.join(__dirname, 'frontend/assets')));

// Rotas específicas da pasta public que ainda precisamos manter
app.get('/sw.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(path.resolve(__dirname, 'public', 'sw.js'));
});

app.get('/manifest.json', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.sendFile(path.resolve(__dirname, 'public', 'manifest.json'));
});

app.get('/offline.html', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.resolve(__dirname, 'public', 'offline.html'));
});

// Rotas da API
app.use('/api', require('./backend/routes/index'));

// Rota para a página inicial
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Middleware para tratar erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.message);
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
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