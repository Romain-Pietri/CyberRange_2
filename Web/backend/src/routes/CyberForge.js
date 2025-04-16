const express = require('express');
const { createScenario } = require('../controllers/CyberForgeController');
const { get_scenarios } = require('../controllers/CyberForgeController');

const router = express.Router();

// Route pour créer un scénario
router.post('/create-scenario', createScenario);
router.post('/get-scenario', (req, res) => {get_scenarios(req, res)});

module.exports = router;