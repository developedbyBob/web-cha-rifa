const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');

// Rota para obter todas as reservas
router.get('/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para criar uma nova reserva
router.post('/reservations', async (req, res) => {
  const reservation = new Reservation({
    number: req.body.number,
    name: req.body.name,
    phone: req.body.phone,
    gift: req.body.gift
  });

  try {
    const newReservation = await reservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rota para remover uma reserva
router.delete('/reservations/:number', async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndDelete({ number: req.params.number });
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }
    res.json({ message: 'Reserva removida' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
