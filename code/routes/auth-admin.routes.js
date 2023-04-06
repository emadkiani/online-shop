const express = require( 'express' );

const adminController = require( '../controllers/auth-admin.controller' );

const router = express.Router();

router.get( '/signup-admin', adminController.getAdminSignup ); // Just for the first time to create an Admin Account

router.post( '/signup-admin', adminController.adminSignup ); // Just for the first time to create an Admin Account

router.get( '/login-admin', adminController.getAdminLogin );

router.post( '/login-admin', adminController.adminLogin );

module.exports = router;
