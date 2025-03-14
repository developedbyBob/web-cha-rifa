// backend/services/reservationService.js
const Reservation = require('../models/reservation');

exports.createReservation = async (number, name, phone, gift) => {
  const reservation = new Reservation({
    number,
    name,
    phone,
    gift
  });
  
  return await reservation.save();
};

exports.deleteReservation = async (number) => {
  return await Reservation.findOneAndDelete({ number });
};

exports.getAllReservations = async () => {
  return await Reservation.find();
};