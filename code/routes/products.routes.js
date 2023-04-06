const express = require( 'express' );

const productsController = require( '../controllers/products.controller' );

const router = express.Router();

router.get( '/products', productsController.getAllProducts );

router.get( '/products/search', productsController.getSearchProducts );

router.post( '/products/search', productsController.searchProducts );

router.get( '/products/:id', productsController.getProductDetails );

module.exports = router;