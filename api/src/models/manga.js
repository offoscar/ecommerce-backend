const mongoose = require('mongoose');

const mangaSchema = new mongoose.Schema({
  titulo: { type: String, required: [true, 'El título es obligatorio'], index: true },
  volumen: { type: Number, min: 1, default: 1 },
  autor: { type: String, required: true },
  precio: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  sinopsis: String,
  isbn: { type: String, required: true, unique: true },
  editorial: { type: mongoose.Schema.Types.ObjectId, ref: 'Editorial', required: true },
  proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor', required: true },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Manga', mangaSchema);