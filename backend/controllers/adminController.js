// backend/controllers/adminController.js
const jwt = require('jsonwebtoken');
const Reservation = require('../models/reservation');
const { ADMIN_PASSWORD, JWT_SECRET } = require('../config/env');

exports.login = (req, res) => {
  const { password } = req.body;
  
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { admin: true },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    return res.status(200).json({ token });
  }
  
  res.status(401).json({ message: 'Senha incorreta' });
};

exports.drawWinner = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    if (reservations.length === 0) {
      return res.status(400).json({ message: 'Não há participantes para sortear' });
    }
    
    const randomIndex = Math.floor(Math.random() * reservations.length);
    const winner = reservations[randomIndex];
    
    res.status(200).json({ winner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndDelete({ number: parseInt(req.params.number) });
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }
    res.status(200).json({ message: 'Reserva removida com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    
    // Estatísticas por tipo de presente
    const giftStats = {};
    
    reservations.forEach(reservation => {
      if (!giftStats[reservation.gift]) {
        giftStats[reservation.gift] = 1;
      } else {
        giftStats[reservation.gift]++;
      }
    });
    
    // Total de participantes e números disponíveis
    const stats = {
      totalParticipants: reservations.length,
      availableNumbers: 100 - reservations.length,
      giftDistribution: giftStats
    };
    
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};