const express = require('express');
const router = express.Router();
const { getProfile, getCachedProfile, compareProfiles } = require('../controllers/profileController');
const { checkCache } = require('../middleware/cache');

router.get('/profile/:username', checkCache, getProfile);

router.get('/profile/:username/cached', getCachedProfile);

router.get('/compare', compareProfiles);

module.exports = router;
