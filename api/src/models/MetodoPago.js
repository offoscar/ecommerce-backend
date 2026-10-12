const mongoose = require('mongoose');

const metodoPagoSchema = new mongoose.Schema({
  tipo: { 
    type: String, 
    enum: ['Tarjeta', 'PayPal', 'Transferencia'], 
    required: true 
  },
  estado_pago: { type: String, default: 'Pendiente' }
}, { timestamps: true });

module.exports = mongoose.model('MetodoPago', metodoPagoSchema);