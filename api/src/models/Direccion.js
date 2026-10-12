const mongoose = require('mongoose');

const direccionSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  calle: { type: String, required: true },
  ciudad: { type: String, required: true },
  codigo_postal: { type: String, required: true },
  provincia: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Direccion', direccionSchema);