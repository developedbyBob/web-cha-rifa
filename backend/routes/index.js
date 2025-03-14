const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const validateMiddleware = require('../middleware/validate');

// Rota de teste para verificar se a API está funcionando
router.get('/status', (req, res) => {
  res.status(200).json({ message: 'API está funcionando!' });
});

// Rotas para reservas
router.get('/reservations', reservationController.getAllReservations);
router.post('/reservations', 
  validateMiddleware.validate(validateMiddleware.reservationValidators),
  reservationController.createReservation
);

// Rota de login para admin
router.post('/admin/login', adminController.login);

// Rotas protegidas de admin
router.post('/admin/draw', authMiddleware, adminController.drawWinner);
router.delete('/reservations/:number', authMiddleware, adminController.deleteReservation);
router.get('/admin/stats', authMiddleware, adminController.getStats);

module.exports = router;