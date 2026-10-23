const Product = require('../models/Manga');
const { AppError } = require('../middleware/errorHandler');
const { validateId } = require('../utils/helpers');

const notFound = () => new AppError(404, 'PRODUCT_NOT_FOUND', 'Producte no trobat');

const getProducts = async () => {
    return await Product.find().populate('categoria', 'name slug');
};

const getProductById = async (id) => {
    validateId(id);
    const product = await Product.findById(id).populate('categoria', 'name slug');
    if (!product) throw notFound();
    return product;
};

const createProduct = async (productData) => {
    const newProduct = new Product(productData);
    return await newProduct.save();
};

const updateProduct = async (id, productData) => {
    validateId(id);
    const product = await Product.findByIdAndUpdate(id, productData, {
        new: true,
        runValidators: true
    });
    if (!product) throw notFound();
    return product;
};

const deleteProduct = async (id) => {
    validateId(id);
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw notFound();
    return product;
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};