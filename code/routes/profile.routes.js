const express = require( 'express' );

const profileController = require( '../controllers/profile.controller' );

const router = express.Router();

router.get( '/update-profile/:id', profileController.getUpdateProfile );

router.post( '/update-profile/:id', profileController.updateProfile );

router.post( '/logout', profileController.logout );

module.exports = router;
