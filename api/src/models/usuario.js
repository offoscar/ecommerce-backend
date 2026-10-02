const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellidos: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true, // Crea un índice único (no admite correos repetidos)
        index: true,  // Optimiza las búsquedas por email
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Introduce un email válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    telefono: {
        type: String
    },
    rol: {
        type: String,
        enum: ['cliente', 'empleado', 'admin'], // Solo permite estos 3 valores
        default: 'cliente'
    },
    // Dirección incrustada (Subdocumento)
    direccion: {
        calle: String,
        ciudad: String,
        codigo_postal: String,
        provincia: String
    }
}, {
    timestamps: true // Añade automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('Usuario', usuarioSchema);