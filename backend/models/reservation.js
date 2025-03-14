// backend/models/reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, 'Número é obrigatório'],
    unique: true,
    min: 1,
    max: 100
  },
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
    trim: true,
    validate: {
      validator: function(v) {
        // Validação básica de telefone (ajuste conforme necessário)
        return /^(\d{10,11}|\(\d{2}\)\s*\d{4,5}-\d{4})$/.test(v);
      },
      message: props => `${props.value} não é um número de telefone válido!`
    }
  },
  gift: {
    type: String,
    required: [true, 'Presente é obrigatório'],
    enum: ['Fralda RN', 'Fralda P', 'Fralda M', 'Fralda G', 'Pix R$30', 'Pix R$35', 'Pix R$40', 'Pix R$45']
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt
});

// Índice para consultas mais rápidas
reservationSchema.index({ number: 1 });

// Middleware para validar número único antes de salvar
reservationSchema.pre('save', async function(next) {
  const reservation = this;
  
  // Verificar se o número já está reservado
  const existingReservation = await this.constructor.findOne({ number: reservation.number });
  if (existingReservation && existingReservation._id.toString() !== reservation._id.toString()) {
    const error = new Error('Este número já está reservado');
    return next(error);
  }
  
  next();
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;