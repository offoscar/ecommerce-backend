const mongoose = require('mongoose');

const lineaPedidoSchema = new mongoose.Schema({
  pedido: { type: mongoose.Schema.Types.ObjectId, ref: 'Pedido', required: true },
  manga: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga', required: true },
  cantidad: { type: Number, required: true, min: 1 },
  precio_unitario: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('LineaPedido', lineaPedidoSchema);