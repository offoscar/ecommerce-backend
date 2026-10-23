const { AppError } = require('../middleware/errorHandler');

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

// Valida que l'id sigui un ObjectId (24 caràcters hexadecimals)
function validateId(id) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new AppError(400, 'INVALID_ID', "L'identificador no és vàlid", [
            { field: 'id', message: 'Ha de ser un ObjectId de 24 caràcters hexadecimals' },
        ]);
    }
}

// Llista explícita de camps: només es copien els permesos
function pick(obj, fields) {
    const result = {};
    for (const f of fields) {
        if (obj && obj[f] !== undefined) result[f] = obj[f];
    }
    return result;
}

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Valida i converteix els query parameters: active, name, sort, page, limit
function buildListQuery(query, allowedSortFields) {
    const errors = [];
    const filter = {};

    if (query.active !== undefined) {
        if (query.active === 'true' || query.active === 'false') {
            filter.active = query.active === 'true';
        } else {
            errors.push({ field: 'active', message: 'Ha de ser true o false' });
        }
    }

    if (query.name !== undefined) {
        if (typeof query.name !== 'string' || !query.name.trim()) {
            errors.push({ field: 'name', message: 'Ha de ser un text no buit' });
        } else {
            filter.name = { $regex: escapeRegex(query.name.trim()), $options: 'i' };
        }
    }

    let sort = { createdAt: 1, _id: 1 };
    if (query.sort !== undefined) {
        const raw = typeof query.sort === 'string' ? query.sort : '';
        const desc = raw.startsWith('-');
        const field = desc ? raw.slice(1) : raw;
        if (allowedSortFields.includes(field)) {
            sort = { [field]: desc ? -1 : 1, _id: 1 };
        } else {
            errors.push({ field: 'sort', message: `Camps permesos: ${allowedSortFields.join(', ')} (amb "-" davant per ordre descendent)` });
        }
    }

    const positiveInt = (value, field, fallback) => {
        if (value === undefined) return fallback;
        if (!/^[1-9]\d*$/.test(String(value))) {
            errors.push({ field, message: 'Ha de ser un enter positiu' });
            return fallback;
        }
        return Number(value);
    };
    const page = positiveInt(query.page, 'page', 1);
    const limit = Math.min(positiveInt(query.limit, 'limit', DEFAULT_LIMIT), MAX_LIMIT);

    if (errors.length) {
        throw new AppError(400, 'INVALID_QUERY', 'Els paràmetres de consulta no són vàlids', errors);
    }
    return { filter, sort, page, limit, skip: (page - 1) * limit };
}

// Consulta amb filtres, ordenació i paginació
async function findPaginated(Model, query, allowedSortFields) {
    const { filter, sort, page, limit, skip } = buildListQuery(query, allowedSortFields);
    const [data, total] = await Promise.all([
        Model.find(filter).sort(sort).skip(skip).limit(limit),
        Model.countDocuments(filter),
    ]);
    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

module.exports = { validateId, pick, buildListQuery, findPaginated };