const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    // Referencia al usuario que realiza la compra
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'Preparación', 'Enviado', 'Entregado'], // Restricción enum
        default: 'Pendiente'
    },
    // Líneas de pedido incrustadas en el mismo documento (Array de objetos)
    lineasPedido: [{
        manga: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Manga',
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            min: [1, 'La cantidad mínima es 1']
        },
        precio_unitario: {
            type: Number,
            required: true
        }
    }],
    metodoPago: {
        type: String,
        enum: ['Tarjeta', 'PayPal', 'Transferencia'], // Restricción enum
        required: true
    },
    total: {
        type: Number,
        required: true,
        min: [0, 'El total no puede ser negativo']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Pedido', pedidoSchema);