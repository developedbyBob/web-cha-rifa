// backend/middleware/validate.js
const { validationResult, body } = require('express-validator');

// Middleware para validar entradas
exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      errors: errors.array()
    });
  };
};

// Validadores comuns
exports.reservationValidators = [
  body('number')
    .isInt({ min: 1, max: 100 })
    .withMessage('O número deve estar entre 1 e 100'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('O nome deve ter entre 2 e 100 caracteres'),
  body('phone')
    .trim()
    .matches(/^(\d{10,11}|\(\d{2}\)\s*\d{4,5}-\d{4})$/)
    .withMessage('Formato de telefone inválido'),
  body('gift')
    .isIn(['Fralda RN', 'Fralda P', 'Fralda M', 'Fralda G', 'Pix R$30', 'Pix R$35', 'Pix R$40', 'Pix R$45'])
    .withMessage('Presente inválido')
];