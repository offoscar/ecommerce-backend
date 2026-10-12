const mongoose = require('mongoose');

const resenaSchema = new mongoose.Schema({
  manga: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga', required: true },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  puntuacion: { type: Number, required: true, min: 1, max: 5 },
  comentario: String,
  fecha: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Resena', resenaSchema);