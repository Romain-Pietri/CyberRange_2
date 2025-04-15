const express = require('express');
const { stopScenario, startScenario, listScenarios, isScenarioRunning } = require('../controllers/gestionVMController');

const router = express.Router();

// Route pour arrêter un scénario
router.post('/stop', stopScenario);

// Route pour démarrer un scénario
router.post('/start', startScenario);

// Route pour lister les scénarios
router.get('/list', listScenarios);

// Route pour vérifier si un scénario est en cours d'exécution
router.get('/isRunning', isScenarioRunning);

module.exports = router;