// backend/controllers/reservationController.js
const Reservation = require('../models/reservation');
const ReservationService = require('../services/reservationService');

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const { number, name, phone, gift } = req.body;
    
    // Verificar se o número já está reservado
    const existingReservation = await Reservation.findOne({ number });
    if (existingReservation) {
      return res.status(400).json({ message: 'Este número já está reservado' });
    }
    
    const newReservation = await ReservationService.createReservation(number, name, phone, gift);
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const result = await ReservationService.deleteReservation(req.params.number);
    if (!result) {
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }
    res.status(200).json({ message: 'Reserva removida com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  const { password } = req.body;
  const { ADMIN_PASSWORD, JWT_SECRET } = require('../config/env');
  
  if (password === ADMIN_PASSWORD) {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '1h' });
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