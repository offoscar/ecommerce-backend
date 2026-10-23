const Category = require('../models/Categoria');
const { AppError } = require('../middleware/errorHandler');
const { validateId, pick, findPaginated } = require('../utils/helpers');

const FIELDS = ['name', 'slug', 'description', 'active'];
const SORT_FIELDS = ['name', 'slug', 'createdAt'];

const notFound = () => new AppError(404, 'CATEGORY_NOT_FOUND', 'Categoria no trobada');

const getCategories = async (query) => {
    return await findPaginated(Category, query, SORT_FIELDS);
};

const getCategoryById = async (id) => {
    validateId(id);
    const category = await Category.findById(id);
    if (!category) throw notFound();
    return category;
};

const createCategory = async (categoryData) => {
    return await Category.create(pick(categoryData, FIELDS));
};

const updateCategory = async (id, categoryData) => {
    validateId(id);
    const category = await Category.findByIdAndUpdate(id, pick(categoryData, FIELDS), {
        new: true,
        runValidators: true,
    });
    if (!category) throw notFound();
    return category;
};

const deleteCategory = async (id) => {
    validateId(id);
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw notFound();
    return category;
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};