const mongoose = require('../database');

const reservationSchema = new mongoose.Schema({
  number: Number,
  name: String,
  phone: String,
  gift: String
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
