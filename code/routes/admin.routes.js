const express = require( 'express' );

const adminController = require( '../controllers/admin.controller' );
const profileAdmin = require( '../controllers/profile-admin.controller' );
const imageUploadMiddleware = require( '../middlewares/image-upload' );

const router = express.Router();

router.get( '/products', adminController.getProducts );

router.get( '/products/search', adminController.getSearchProducts );

router.post( '/products/search', adminController.searchProducts );

router.get( '/products/new', adminController.getNewProduct );

router.post( '/products', imageUploadMiddleware, adminController.createNewProduct );

router.get( '/products/:id', adminController.getUpdateProduct );

router.post( '/products/:id', imageUploadMiddleware, adminController.updateProduct );

router.delete( '/products/:id', adminController.deleteProduct );

router.get( '/orders', adminController.getOrders );

router.get( '/orders/search', adminController.getSearchOrders );

router.post( '/orders/search', adminController.searchOrders );

router.patch( '/orders/:id', adminController.updateOrder );

router.get( '/update-admin/:id', profileAdmin.getUpdateAdmin );

router.post( '/update-admin/:id', profileAdmin.updateAdmin );

router.post( '/logout', profileAdmin.logout );

module.exports = router;