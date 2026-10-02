const mongoose = require('mongoose');

const mangaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título del manga es obligatorio'],
        index: true // Índice para acelerar búsquedas por título
    },
    volumen: {
        type: Number,
        min: [1, 'El volumen mínimo es 1'],
        default: 1
    },
    autor: {
        type: String,
        required: [true, 'El autor es obligatorio']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo'],
        // Validación custom: comprueba que solo tenga máximo 2 decimales
        validate: {
            validator: function (v) {
                return /^\d+(\.\d{1,2})?$/.test(v.toString());
            },
            message: 'El precio solo puede tener hasta 2 decimales'
        }
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'El stock no puede ser menor a 0'],
        default: 0
    },
    sinopsis: {
        type: String
    },
    isbn: {
        type: String,
        required: [true, 'El ISBN es obligatorio'],
        unique: true // Índice único
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Manga', mangaSchema);