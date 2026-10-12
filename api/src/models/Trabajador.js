const mongoose = require('mongoose');

const trabajadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  dni: { type: String, required: true, unique: true },
  puesto: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email no válido'] 
  },
  salario: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Trabajador', trabajadorSchema);