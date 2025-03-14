// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

// Rota de login
router.post('/login', adminController.login);

// Rotas protegidas
router.use(authMiddleware);

// Apenas administradores autenticados podem acessar essas rotas
router.post('/draw', adminController.drawWinner);
router.delete('/reservations/:number', adminController.deleteReservation);
router.get('/stats', adminController.getStats);

module.exports = router;