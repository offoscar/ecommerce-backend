const bcrypt = require('bcrypt');
const User = require('../models/Usuario');
const { AppError } = require('../middleware/errorHandler');
const { validateId, pick, findPaginated } = require('../utils/helpers');

// Llista explícita de camps que el client pot enviar (role, active i passwordHash NO)
const PROFILE_FIELDS = ['name', 'apellidos', 'email', 'telefono'];
const ALLOWED_FIELDS = [...PROFILE_FIELDS, 'password'];
const SORT_FIELDS = ['name', 'email', 'createdAt'];
const SALT_ROUNDS = 12;

const notFound = () => new AppError(404, 'USER_NOT_FOUND', 'Usuari no trobat');

function assertAllowedFields(body) {
    const forbidden = Object.keys(body).filter((k) => !ALLOWED_FIELDS.includes(k));
    if (forbidden.length) {
        throw new AppError(
            400,
            'FIELD_NOT_ALLOWED',
            'Hi ha camps que no es poden enviar o modificar',
            forbidden.map((field) => ({ field, message: 'Camp no permès' }))
        );
    }
}

function validatePassword(password) {
    if (typeof password !== 'string' || password.length < 12) {
        throw new AppError(422, 'VALIDATION_ERROR', 'Les dades no són vàlides', [
            { field: 'password', message: 'La contrasenya és obligatòria i ha de tenir mínim 12 caràcters' },
        ]);
    }
}

const getUsers = async (query) => {
    return await findPaginated(User, query, SORT_FIELDS);
};

const getUserById = async (id) => {
    validateId(id);
    const user = await User.findById(id);
    if (!user) throw notFound();
    return user;
};

const createUser = async (userData) => {
    const body = userData || {};
    assertAllowedFields(body);
    validatePassword(body.password);
    const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);
    // role i active els assigna el servidor (valors per defecte de l'esquema: client / true)
    return await User.create({ ...pick(body, PROFILE_FIELDS), passwordHash });
};

const updateUser = async (id, userData) => {
    validateId(id);
    const body = userData || {};
    assertAllowedFields(body);
    const changes = pick(body, PROFILE_FIELDS);
    if (body.password !== undefined) {
        validatePassword(body.password);
        changes.passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);
    }
    const user = await User.findByIdAndUpdate(id, changes, { new: true, runValidators: true });
    if (!user) throw notFound();
    return user;
};

// Baixa lògica: active = false
const deactivateUser = async (id) => {
    validateId(id);
    const user = await User.findByIdAndUpdate(id, { active: false }, { new: true });
    if (!user) throw notFound();
    return user;
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deactivateUser
};