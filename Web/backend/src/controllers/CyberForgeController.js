const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
// Fonction pour copier récursivement un dossier
const copyFolderRecursiveSync = (src, dest) => {
    if (!fs.existsSync(src)) {
        console.warn(`Le dossier source n'existe pas : ${src}`);
        return;
    }

    // Créer le dossier de destination s'il n'existe pas
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    // Lire le contenu du dossier source
    const entries = fs.readdirSync(src, { withFileTypes: true });

    entries.forEach((entry) => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // Si l'entrée est un dossier, appeler récursivement
            copyFolderRecursiveSync(srcPath, destPath);
        } else {
            // Si l'entrée est un fichier, le copier
            fs.copyFileSync(srcPath, destPath);
        }
    });
};

exports.createScenario = (req, res) => {
    const { scenarioName } = req.body;
    console.log("scenarioName", scenarioName);

    if (!scenarioName) {
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

        // Créer le fichier isrunning
        const isRunningPath = path.join(scenariosDir, 'isrunning');
        fs.writeFileSync(isRunningPath, '0', 'utf-8'); // 0 signifie que le scénario n'est pas en cours d'exécution

        // Copier le contenu du répertoire model dans le répertoire du scénario
        const modelDir = path.join(__dirname, '/model');
        copyFolderRecursiveSync(modelDir, scenariosDir);

        return res.status(201).json({ message: 'Scénario créé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la création du scénario :', error);
        return res.status(500).json({ message: 'Erreur lors de la création du scénario.' });
    }
};

exports.get_scenarios = (req, res) => {
    // Renvoie un JSON contenant le scénario avec toutes les informations nécessaires
    console.log(req.body);
    const { scenarioName } = req.body;

    console.log("scenarioName", scenarioName);
    const scenariosDir = path.join(__dirname, '../../../../');

    // Vérifier si le répertoire du scénario existe
    if (!fs.existsSync(scenariosDir)) {
        return res.status(404).json({ message: 'Le scénario n\'existe pas.' });
    }

    // Lire le contenu du dossier du scénario
    const scenarioPath = path.join(scenariosDir, scenarioName);

    // Parser le fichier docker-compose.yml
    const dockerComposePath = path.join(scenarioPath, 'docker-compose.yml');
    if (!fs.existsSync(dockerComposePath)) {
        return res.status(404).json({ message: 'Le fichier docker-compose.yml n\'existe pas.' });
    }

    try {
        const dockerComposeContent = fs.readFileSync(dockerComposePath, 'utf-8');
        const dockerComposeJson = yaml.parse(dockerComposeContent); // Utilisation de yaml.parse
        console.log("dockerComposeJson", dockerComposeJson);

        return res.status(200).json({ scenarioName, dockerComposeJson });
    } catch (error) {
        console.error('Erreur lors du parsing du fichier YAML :', error);
        return res.status(500).json({ message: 'Erreur lors du parsing du fichier YAML.' });
    }
};