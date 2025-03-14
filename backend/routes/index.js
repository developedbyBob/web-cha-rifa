const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const validateMiddleware = require('../middleware/validate');

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