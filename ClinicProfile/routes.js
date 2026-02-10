// Backend/ClinicProfile/routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Save clinic profile (create or update)
router.post('/', controller.saveProfile);

// Get clinic profile
router.get('/', controller.getProfile);

// Update clinic profile
router.put('/', controller.updateProfile);

// Check if profile exists
router.get('/exists', controller.checkProfileExists);

module.exports = router;