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

// Route pour supprimer un scénario
const fs = require('fs');
const path = require('path');

router.post('/delete', async (req, res) => {
    const { scenario } = req.body;
    const scenarioPath = path.join(__dirname, '../../../../', scenario); // Le chemin du dossier à supprimer

    try {
        // Suppression du dossier et de son contenu
        fs.rm(scenarioPath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error('Erreur lors de la suppression :', err);
                return res.status(500).json({ message: 'Erreur lors de la suppression du scénario.' });
            }
            return res.status(200).json({ message: `Scénario "${scenario}" supprimé avec succès.` });
        });
    } catch (error) {
        console.error('Erreur système :', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du scénario.' });
    }
});


module.exports = router;