// Genera dades FICTÍCIES per provar filtres, ordenació i paginació (només en local).
// Ús (des de la carpeta api): node scripts/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const categoryService = require('../src/services/categoryService');
const userService = require('../src/services/userService');

const categoryBase = ['Informàtica', 'Electrònica', 'Llar', 'Esport', 'Jardí', 'Joguines', 'Moda', 'Llibres', 'Música', 'Cuina'];
const firstNames = ['Anna', 'Pere', 'Marta', 'Joan', 'Laia'];
const slugify = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-');

async function createIgnoringDuplicates(fn) {
    try {
        await fn();
        return 1;
    } catch (err) {
        if (err.code === 11000) return 0; // ja existeix
        throw err;
    }
}

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    let categories = 0;
    let users = 0;

    for (let i = 1; i <= 25; i++) {
        const name = `${categoryBase[i % categoryBase.length]} ${i}`;
        categories += await createIgnoringDuplicates(() =>
            categoryService.createCategory({ name, slug: slugify(name), description: `Categoria de prova ${i}`, active: i % 4 !== 0 })
        );
    }

    for (let i = 1; i <= 25; i++) {
        const first = firstNames[i % firstNames.length];
        users += await createIgnoringDuplicates(() =>
            userService.createUser({
                name: `${first} Prova ${i}`,
                email: `${first.toLowerCase()}${i}@example.com`,
                password: 'Contrasenya-de-prova-123',
            })
        );
    }

    console.log(`Categories creades: ${categories} · Usuaris creats: ${users}`);
    await mongoose.disconnect();
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});