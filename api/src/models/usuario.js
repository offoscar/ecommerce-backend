const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email no válido'] 
  },
  password: { type: String, required: true, minlength: 6 },
  telefono: String
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);