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

// Servir arquivos estáticos - tornar isto mais robusto para o ambiente Vercel
// Para componentes JavaScript
app.use('/components', express.static(path.join(__dirname, 'frontend/components'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

// Para arquivos CSS
app.use('/css', express.static(path.join(__dirname, 'frontend/css'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'text/css');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

// Para arquivos JavaScript
app.use('/js', express.static(path.join(__dirname, 'frontend/js'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

// Para arquivos de assets (imagens, etc)
app.use('/assets', express.static(path.join(__dirname, 'frontend/assets'), {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

// Servir arquivos da raiz do frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Rotas específicas da pasta public que ainda precisamos manter
app.get('/sw.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.resolve(__dirname, 'public', 'sw.js'));
});

app.get('/manifest.json', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.sendFile(path.resolve(__dirname, 'public', 'manifest.json'));
});

app.get('/site.webmanifest', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.sendFile(path.resolve(__dirname, 'public', 'site.webmanifest'));
});

app.get('/offline.html', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.resolve(__dirname, 'public', 'offline.html'));
});

// Rotas da API
app.use('/api', require('./backend/routes/index'));

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Rota de fallback para SPA
app.get('*', (req, res) => {
  // Verificar se a solicitação é para um arquivo
  if (req.url.indexOf('.') === -1) {
    // É uma rota de SPA, retornar index.html
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
  } else {
    // Tentar servir o arquivo estático
    const filePath = path.join(__dirname, 'frontend', req.url);
    
    // Verificar se o arquivo existe
    res.sendFile(filePath, (err) => {
      if (err) {
        // Se o arquivo não for encontrado, retornar 404
        res.status(404).send('Arquivo não encontrado');
      }
    });
  }
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
const server = app.listen(PORT || 3000, () => {
  console.log(`Servidor rodando na porta ${PORT || 3000}`);
});

// Tratamento de sinais para desligamento gracioso
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido, desligando graciosamente');
  server.close(() => {
    console.log('Servidor fechado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido, desligando graciosamente');
  server.close(() => {
    console.log('Servidor fechado');
    process.exit(0);
  });
});