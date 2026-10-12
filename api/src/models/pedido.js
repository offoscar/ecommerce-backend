const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  estado: { 
    type: String, 
    enum: ['Pendiente', 'Preparación', 'Enviado', 'Entregado'], 
    default: 'Pendiente' 
  },
  total: { type: Number, required: true, min: 0 },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  trabajador: { type: mongoose.Schema.Types.ObjectId, ref: 'Trabajador' },
  direccion: { type: mongoose.Schema.Types.ObjectId, ref: 'Direccion', required: true },
  metodoPago: { type: mongoose.Schema.Types.ObjectId, ref: 'MetodoPago', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Pedido', pedidoSchema);