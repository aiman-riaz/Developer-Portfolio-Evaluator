const express = require('express');
const router = express.Router();
const { getProfile, getCachedProfile, compareProfiles } = require('../controllers/profileController');
const { checkCache } = require('../middleware/cache');

// GET /api/profile/:username  — check cache first, then live fetch
router.get('/profile/:username', checkCache, getProfile);

// GET /api/profile/:username/cached  — return cached only
router.get('/profile/:username/cached', getCachedProfile);

// GET /api/compare?u1=:u1&u2=:u2  — compare two users
router.get('/compare', compareProfiles);

module.exports = router;
