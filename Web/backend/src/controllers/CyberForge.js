const fs = require('fs');
const path = require('path');

exports.createScenario = (req, res) => {
    const { scenarioName, dockerComposeContent, dockerfileContent } = req.body;

    if (!scenarioName || !dockerComposeContent || !dockerfileContent) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const scenariosDir = path.join(__dirname, '../../../../', scenarioName);

    // Vérifier si le répertoire du scénario existe déjà
    if (fs.existsSync(scenariosDir)) {
        return res.status(400).json({ message: 'Le scénario existe déjà.' });
    }

    try {
        // Créer le répertoire du scénario
        fs.mkdirSync(scenariosDir, { recursive: true });

        //créér le fichier isrunning
        const isRunningPath = path.join(scenariosDir, 'isrunning');
        fs.writeFileSync(isRunningPath, '0', 'utf-8'); // 0 signifie que le scénario n'est pas en cours d'exécution

        
      
        

        return res.status(201).json({ message: 'Scénario créé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la création du scénario :', error);
        return res.status(500).json({ message: 'Erreur lors de la création du scénario.' });
    }
};