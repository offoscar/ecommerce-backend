const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nom és obligatori'],
    trim: true,
    minlength: [3, 'El nom ha de tenir mínim 3 caràcters'],
  },
  slug: {
    type: String,
    required: [true, 'El slug és obligatori'],
    trim: true,
    unique: true, // índex únic (no és una validació de Mongoose)
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripció pot tenir màxim 500 caràcters'],
  },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Categoria', categoriaSchema);