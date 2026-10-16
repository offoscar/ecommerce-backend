require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes'); // Importem les rutes


const app = express();
app.use(express.json());

// Conexión directa a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connectat correctament');
  })
  .catch(err => {
    console.error('Error de connexió a MongoDB:', err.message);
    process.exit(1);
  });

app.get('/', (req, res) => res.send('API Ecommerce en marxa '));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));

// Muntem les rutes de productes sota el prefix '/api/products'
app.use('/api/products', productRoutes);

require('./models/Manga');
require('./models/Editorial');
require('./models/Proveedor');
require('./models/Categoria');
require('./models/Usuario');
require('./models/Direccion');
require('./models/Trabajador');
require('./models/Pedido');
require('./models/LineaPedido');
require('./models/MetodoPago');
require('./models/Resena');