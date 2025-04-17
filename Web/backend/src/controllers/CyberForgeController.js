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
        const modelDir = path.join(__dirname, '/init_model/');
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
    let dockerComposeJson = {};

    try {
        const dockerComposeContent = fs.readFileSync(dockerComposePath, 'utf-8');
        dockerComposeJson = yaml.parse(dockerComposeContent); // Utilisation de yaml.parse
        console.log("dockerComposeJson", dockerComposeJson);
        


    } catch (error) {
        console.error('Erreur lors du parsing du fichier YAML :', error);
        return res.status(500).json({ message: 'Erreur lors du parsing du fichier YAML.' });
    }
    //TODO : 
    // Ajouter les autres Dockerfile et fichiers 
    // Ajouter les autres fichiers nécessaires au scénario

    //rajoute tous les fichiers qui sont dans les dossier du scénario hors : ./data, drive, init,record
    const files = fs.readdirSync(scenarioPath, { withFileTypes: true });
    const dirToExclude = ['data', 'drive', 'init', 'record'];
    const filesToExclude = ['docker-compose.yml', 'isrunning', 'script.py','down.py', 'Dockerfile.kali_blue', 'Dockerfile.kali_red', 'Dockerfile.filebeat', 'filebeat.yml', "vm_connections.json", "README.md"];
    const getFilesRecursively = (dir, dirToExclude, baseDir) => {
        const result = [];

        const entries = fs.readdirSync(dir, { withFileTypes: true });

        entries.forEach((entry) => {
            const entryPath = path.join(dir, entry.name);

            // Skip excluded directories
            if (entry.isDirectory() && dirToExclude.includes(entry.name)) {
                return;
            }

            // Skip excluded files
            if (!entry.isDirectory() && filesToExclude.includes(entry.name)) {
                return;
            }

            if (entry.isDirectory()) {
                // Recursively process subdirectories
                result.push(...getFilesRecursively(entryPath, dirToExclude, baseDir));
            } else {
                // Include files
                const relativePath = path.relative(baseDir, entryPath);
                const content = fs.readFileSync(entryPath, 'utf-8');
                result.push({
                    name: entry.name,
                    path: relativePath,
                    content: content,
                });
            }
        });

        return result;
    };

    const filesJson = getFilesRecursively(scenarioPath, dirToExclude, scenarioPath, filesToExclude);
    //console.log("filesJson", filesJson);

    //renvoie le json avec le contenu de dockerComposeJson et filesJson
    const response = {
        dockerComposeJson: dockerComposeJson,
        filesJson: filesJson,
        scenarioName: scenarioName,
    };
    //console.log("response", response);
    res.json(response);

    
};

exports.updateScenario = (req, res) => {
    const { scenarioName, NbRed, NbBlue, BoolSiem,dockerComposeJson} = req.body;
    
     // Vérification des champs requis
     //if (!scenarioName || NbRed === undefined || NbBlue === undefined || BoolSiem === undefined || !dockerComposeJson) {
     //   return res.status(400).json({ message: 'Tous les champs (scenarioName, NbRed, NbBlue, BoolSiem, config_yml) sont requis.' });
    //}

    console.log("Données reçues :");
    console.log("scenarioName :", scenarioName);
    console.log("NbRed :", NbRed);
    console.log("NbBlue :", NbBlue);
    console.log("BoolSiem :", BoolSiem);
    //console.log("dockerComposeJson :", dockerComposeJson);

    // Vérifier si le scénario existe
    
   
    const scenariosDir = path.join(__dirname, '../../../../');

    // Vérifier si le répertoire du scénario existe
    if (!fs.existsSync(scenariosDir)) {
        return res.status(404).json({ message: 'Le scénario n\'existe pas.' });
    }

    if(!scenarioName) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }
    const scenarioPath = path.join(scenariosDir, scenarioName);

    // Vérifier si le répertoire du scénario existe
    if (!fs.existsSync(scenarioPath)) {
        return res.status(404).json({ message: 'Le scénario n\'existe pas.' });
    }

    //lire le contenu de la variable config_yml
    //Met le bon nombre de machine Kali 

    //recherche dans dockerComposeJson le nombre de machine kali_blue
    let countBlue = 0;
    let countRed = 0;

    for (const serviceName in dockerComposeJson.services) {
        if (serviceName.startsWith('kali_blue')) {
            countBlue++;
        } else if (serviceName.startsWith('kali_red')) {
            countRed++;
        }
    }
    console.log("countBlue", countBlue);
    console.log("countRed", countRed);
    //s'il y a plus de machine que demandé on les supprime
    if (countBlue > NbBlue) {
        for (let i = countBlue; i > NbBlue; i--) {
            delete dockerComposeJson.services[`kali_blue${i}`];
        }
    } else if (countBlue < NbBlue) {
        for (let i = countBlue + 1; i <= NbBlue; i++) {
            dockerComposeJson.services[`kali_blue${i}`] = {
                dockerfile: 'Dockerfile.kali_blue',
                container_name: `kali_blue_${i}`,
                ports: [`${3389 + i}:3389`],
                privileged: true,
                networks: [
                    "guacnetwork_compose",
                    "vulnerable_network"
                ]

            };
        }
    }
    //s'il y a plus de machine que demandé on les supprime
    if (countRed > NbRed) {
        for (let i = countRed; i > NbRed; i--) {
            delete dockerComposeJson.services[`kali_red${i}`];
            console.log("delete kali_red", i);
        }
    } else if (countRed < NbRed) {
        for (let i = countRed + 1; i <= NbRed; i++) {
            dockerComposeJson.services[`kali_red${i}`] = {
                dockerfile: 'Dockerfile.kali_red',
                container_name: `kali_red_${i}`,
                ports: [`${3389 + i}:3389`],
                privileged: true,
                networks: {
                    guacnetwork_compose: {},
                    vulnerable_network: {}
                }

            };
        }
    }
    let siemJson={}
    try {
        const siemData = fs.readFileSync(path.join(__dirname, '/other_model/Siem.yml'), 'utf-8');
        siemJson = yaml.parse(siemData);
        console.log("siemJson", siemJson);
    } catch (err) {
        console.error('Erreur lors de la lecture du fichier Siem.yml :', err);
        return res.status(500).json({ message: 'Erreur lors de la lecture du fichier Siem.yml.' });
    }
    
    //console.log("dockerComposeJson", dockerComposeJson);
    //On vérifie si BoolSiem est vrai ou faux
    //Si c'est vrai on ajoute siemJson au dockerComposeJson
    //Sinon on le supprime

    if (BoolSiem) {
        //fait une comparaison entre le dockerComposeJson et le siemJson
        //s'il n'est pas présent on l'ajoute
        // Ajoute les services de siemJson.services au dockerComposeJson.services
        console.log("siemJson.services", siemJson.services);
        Object.entries(siemJson.services).forEach(([key, value]) => {
            if (!dockerComposeJson.services[key]) {
                dockerComposeJson.services[key] = value;
            }
        });
        // Vérifie si dockerComposeJson.volumes existe, sinon l'initialise
        if (!dockerComposeJson.volumes) {
            dockerComposeJson.volumes = {};
        }

        // Ajoute le volume siem au dockerComposeJson
        dockerComposeJson.volumes.ssh_logs = siemJson.volumes.ssh_logs;
        
        //Ajoute le fichier filebeat.yml au dossier du scénario
        const filebeatPath = path.join(scenarioPath, 'filebeat.yml');
        if (!fs.existsSync(filebeatPath)) {
            fs.copyFileSync(path.join(__dirname, '/other_model/filebeat.yml'), filebeatPath);
        }
        //ajoute le fichier Dockerfile.filebeat au dossier du scénario
        const dockerfilePath = path.join(scenarioPath, 'Dockerfile.filebeat');
        if (!fs.existsSync(dockerfilePath)) {
            fs.copyFileSync(path.join(__dirname, '/other_model/Dockerfile.filebeat'), dockerfilePath);
        }


    }
    else{
        //supprime le service siem du dockerComposeJson
        // Supprime le service siem du dockerComposeJson
        Object.entries(siemJson.services).forEach(([key, value]) => {
            if (dockerComposeJson.services[key]) {
                delete dockerComposeJson.services[key];
            }
        });
        //supprime le volume siem du dockerComposeJson
        if (dockerComposeJson.volumes && dockerComposeJson.volumes.ssh_logs) {
            delete dockerComposeJson.volumes.ssh_logs;
        }
        //supprime le fichier filebeat.yml du dossier du scénario
        const filebeatPath = path.join(scenarioPath, 'filebeat.yml');
        if (fs.existsSync(filebeatPath)) {
            fs.unlinkSync(filebeatPath);
        }
        //supprime le fichier Dockerfile.filebeat du dossier du scénario
        const dockerfilePath = path.join(scenarioPath, 'Dockerfile.filebeat');
        if (fs.existsSync(dockerfilePath)) {
            fs.unlinkSync(dockerfilePath);
        }

    }
    
    // Mettre à jour le fichier docker-compose.yml
    console.log("dockerComposeJson", dockerComposeJson);
    const dockerComposePath = path.join(scenarioPath, 'docker-compose2.yml');
    try {
        const yamlString = yaml.stringify(dockerComposeJson, { indent: 4 });
        fs.writeFileSync(dockerComposePath, yamlString, 'utf-8');
    } catch (error) {
        console.error('Erreur lors de l\'écriture du fichier YAML :', error);
        return res.status(500).json({ message: 'Erreur lors de l\'écriture du fichier YAML.' });
    }
    res.status(200).json({ message: 'Scénario mis à jour avec succès.' });
}
exports.uploadFile = (req, res) => {
    const { scenarioName, file, pathFile, nameFile } = req.body;

    console.log("scenarioName", scenarioName);
    console.log("dockerfile", file);
    console.log("path", pathFile);
    console.log("nameFile", nameFile);

    // Vérification des champs requis
    if (!scenarioName || !file || !pathFile || !nameFile) {
        return res.status(400).json({ message: 'Tous les champs (scenarioName, file, pathFile, nameFile) sont requis.' });
    }

    // Vérifier si le scénario existe
    const scenariosDir = path.join(__dirname, '../../../../');
    if (!fs.existsSync(scenariosDir)) {
        return res.status(404).json({ message: 'Le répertoire des scénarios n\'existe pas.' });
    }

    const scenarioPath = path.join(scenariosDir, scenarioName);
    if (!fs.existsSync(scenarioPath)) {
        return res.status(404).json({ message: 'Le scénario spécifié n\'existe pas.' });
    }

    // S'assurer que pathFile se termine par un "/"
    const normalizedPathFile = pathFile.endsWith('/') ? pathFile : `${pathFile}/`;

    // Construire le chemin complet du répertoire
    const fullPath = path.join(scenarioPath, normalizedPathFile);

    // Créer tous les répertoires nécessaires dans pathFile
    try {
        fs.mkdirSync(fullPath, { recursive: true });
    } catch (error) {
        console.error('Erreur lors de la création des répertoires :', error);
        return res.status(500).json({ message: 'Erreur lors de la création des répertoires.' });
    }

    // Construire le chemin complet du fichier
    const filePath = path.join(fullPath, nameFile);

    // Écrire ou mettre à jour le fichier
    try {
        fs.writeFileSync(filePath, file, 'utf-8');
    } catch (error) {
        console.error('Erreur lors de l\'écriture du fichier :', error);
        return res.status(500).json({ message: 'Erreur lors de l\'écriture du fichier.' });
    }

    return res.status(200).json({ message: 'Fichier créé ou mis à jour avec succès.' });
};
