// Error controlat de l'aplicació (status HTTP + codi + missatge)
class AppError extends Error {
    constructor(status, code, message, details) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

// 404 per a rutes inexistents
function notFound(req, res, next) {
    next(new AppError(404, 'ROUTE_NOT_FOUND', `La ruta ${req.method} ${req.originalUrl} no existeix`));
}

// Middleware global d'errors: sempre el mateix format, sense traces internes.
// Express 5 envia aquí els errors de les funcions async automàticament.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    let status = 500;
    let code = 'INTERNAL_ERROR';
    let message = 'Error intern del servidor';
    let details;

    if (err instanceof AppError) {
        ({ status, code, message, details } = err);
    } else if (err.name === 'ValidationError' && err.errors) {
        // Validacions de Mongoose -> 422
        status = 422;
        code = 'VALIDATION_ERROR';
        message = 'Les dades no són vàlides';
        details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    } else if (err.name === 'CastError') {
        status = 400;
        code = 'INVALID_DATA';
        message = `El valor del camp ${err.path} no és vàlid`;
    } else if (err.code === 11000) {
        // Índex únic de MongoDB (email o slug duplicat) -> 409
        const field = Object.keys(err.keyValue || {})[0] || 'camp';
        status = 409;
        code = 'DUPLICATE_KEY';
        message = `Ja existeix un registre amb aquest valor de ${field}`;
        details = [{ field, message: 'Valor duplicat' }];
    } else if (err.type === 'entity.parse.failed') {
        status = 400;
        code = 'INVALID_JSON';
        message = 'El cos de la petició no és un JSON vàlid';
    } else {
        console.error(err); // la traça només es veu al log del servidor
    }

    const error = { code, message };
    if (details) error.details = details;
    res.status(status).json({ success: false, error });
}

module.exports = { AppError, notFound, errorHandler };