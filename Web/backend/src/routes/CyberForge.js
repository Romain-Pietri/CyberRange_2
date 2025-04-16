const express = require('express');
const { createScenario } = require('../controllers/CyberForgeController');

const router = express.Router();

// Route pour créer un scénario
router.post('/create-scenario', createScenario);

module.exports = router;