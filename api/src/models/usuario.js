const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nom és obligatori'],
    trim: true,
    minlength: [2, 'El nom ha de tenir mínim 2 caràcters'],
  },
  apellidos: String,
  email: {
    type: String,
    required: [true, 'El correu és obligatori'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Format incorrecte']
  },
  passwordHash: { type: String, required: true, select: false },
  telefono: String,
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  active: { type: Boolean, default: true },
}, {
  timestamps: true,
  toJSON: {
    // Mai es retorna el hash
    transform: (doc, ret) => {
      delete ret.passwordHash;
      return ret;
    },
  },
});

module.exports = mongoose.model('Usuario', usuarioSchema);