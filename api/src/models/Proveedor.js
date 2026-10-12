const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
  nombre_empresa: { type: String, required: true },
  cif: { type: String, required: true, unique: true },
  email: { 
    type: String, 
    required: true, 
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email no válido'] 
  },
  telefono: { type: String, required: true },
  direccion: String
}, { timestamps: true });

module.exports = mongoose.model('Proveedor', proveedorSchema);