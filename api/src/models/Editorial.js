const mongoose = require('mongoose');

const editorialSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  pais: { type: String, required: true },
  sitio_web: String
}, { timestamps: true });

module.exports = mongoose.model('Editorial', editorialSchema);