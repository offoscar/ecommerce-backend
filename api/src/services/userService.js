const jwt = require('jsonwebtoken');
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

// Login: valida credencials i retorna JWT + usuari (sense hash)
const loginUser = async (credentials) => {
    const { email, password } = credentials || {};
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
        throw new AppError(422, 'VALIDATION_ERROR', 'Les dades no són vàlides', [
            { field: 'email/password', message: "L'email i la contrasenya són obligatoris" },
        ]);
    }

    // passwordHash té select:false, així que cal demanar-lo explícitament
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');

    // Mateix error si l'usuari no existeix, està desactivat o la contrasenya és incorrecta
    const valid = user && user.active && (await bcrypt.compare(password, user.passwordHash));
    if (!valid) {
        throw new AppError(401, 'INVALID_CREDENTIALS', 'Email o contrasenya incorrectes');
    }

    const token = jwt.sign(
        { sub: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return { token, user }; // toJSON elimina passwordHash
};

module.exports = { 
    getUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deactivateUser, 
    loginUser };