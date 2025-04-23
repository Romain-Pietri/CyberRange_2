const fs = require('fs');
const path = require('path');
function listScenarios(){
  //récupere les répertoires des différents scénarios
  //les scénarios sont stockés dans ../../ 
  console.log(__dirname);
  const scenariosDir = path.join(__dirname, '../../../../');
  console.log(scenariosDir);
  //lister tous les repertoires dans le dossier

  const scenarios = fs.readdirSync(scenariosDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((name) => name !== 'Web') // Exclure le dossier Web
    .filter((name) => name !== '.git'); // Exclure le dossier .git

  console.log(scenarios);
 
  return scenarios;
}
function listScenariosRunning(){
  listscenario = listScenarios();
  let isRunningContent ={};
  // Vérifier si un scénario est en cours d'exécution en regardant le fichier isruning dans le repertoire de chaque scénario
  const scenariosDir = path.join(__dirname, '../../../../');
  const isRunning = listscenario.some((scenario) => {
      const scenarioDir = path.join(scenariosDir, scenario);
      const isRunningFilePath = path.join(scenarioDir, 'isrunning');
      //Si le fichier existe, on l'ouvre et si c'est 1 on le stocke dans une variable
      //sinon on le met à false
      if (fs.existsSync(isRunningFilePath)) {
          //si c'est 1 on le socke dans isRunningContent sous la forme {scenario:1}
          const content = fs.readFileSync(isRunningFilePath, 'utf-8').trim();
          if (content === '1') {
              isRunningContent[scenario] = 1;
          } else {
              isRunningContent[scenario] = 0;
          }
      } 
  });
  //si isRunningContent est vide, on le met à false
  if (Object.keys(isRunningContent).length === 0) {
      isRunningContent = false;
  }
  //renvoie le json avec le contenu de isRunningContent
  console.log(isRunningContent);
  return isRunningContent;
}
exports.isScenarioRunning = (req, res) => {
  res.json(listScenariosRunning());
};

// Lister tous les scénarios disponibles
exports.listScenarios = (req, res) => {
    res.json(listScenarios());
};

// Démarrer un scénario
exports.startScenario = (req, res) => {
  const { scenario } = req.body;
  console.log('scenario', scenario);
  console.log(__dirname);
  // Vérifier si le scénario existe
  const scenarios = listScenarios();
  if (!scenarios.includes(scenario)) {
      return res.status(404).json({ message: 'Scénario non trouvé.' });
  }

  const scenariosDir = path.join(__dirname, '../../../../');
  const scenarioDir = path.join(scenariosDir, scenario);
    const isRunningFilePath = path.join(scenarioDir, 'isrunning');

  // Exécuter le script de démarrage du scénario
  const startScriptPath = path.join(scenarioDir, 'script.py');
  const { exec } = require('child_process');
  console.log("Lancement du script python3 :", startScriptPath);
  exec(`python3 ${startScriptPath} ${scenarioDir}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Erreur lors de l'exécution du script : ${error.message}`);
        console.error(`Sortie standard (stdout) : ${stdout}`);
        console.error(`Sortie d'erreur (stderr) : ${stderr}`);
        // Réinitialiser le fichier isrunning en cas d'erreur
        fs.writeFileSync(isRunningFilePath, '0', 'utf-8');
        return res.status(500).json({
            message: 'Erreur lors de l\'exécution du scénario.',
            error: error.message,
            stdout,
            stderr,
        });
    }

    // Si stderr contient des messages, les afficher sans les traiter comme une erreur critique
    if (stderr) {
        console.warn(`Avertissement ou message dans stderr : ${stderr}`);
    }

    // Traitez stdout normalement
    console.log(`Sortie standard (stdout) : ${stdout}`);
    fs.writeFileSync(isRunningFilePath, '1', 'utf-8');
    return res.status(200).json({
        message: 'Scénario exécuté avec succès.',
        stdout,
        stderr,
    });
});
    
};

// Arrêter un scénario
exports.stopScenario = (req, res) => {
  const { scenario } = req.body;

  const scenarios = listScenarios();
  if (!scenarios.includes(scenario)) {
      return res.status(404).json({ message: 'Scénario non trouvé.' });
  }

  const scenariosDir = path.join(__dirname, '../../../../');
  const scenarioDir = path.join(scenariosDir, scenario);
  const isRunningFilePath = path.join(scenarioDir, 'isrunning');

  // Vérifier si le fichier isrunning existe
  if (!fs.existsSync(isRunningFilePath)) {
      return res.status(404).json({ message: 'Fichier "isrunning" non trouvé.' });
  }

  // Vérifier si le scénario est déjà arrêté
  const content = fs.readFileSync(isRunningFilePath, 'utf-8').trim();
  if (content === '0') {
      return res.status(400).json({ message: 'Le scénario est déjà arrêté.' });
  }

  // Exécuter le script d'arrêt du scénario
  const stopScriptPath = path.join(scenarioDir, 'down.py');
  const { exec } = require('child_process');
  console.log("Lancement du script python3 :", stopScriptPath);

  exec(`python3 ${stopScriptPath} ${scenarioDir}`, (error, stdout, stderr) => {
      // Si une erreur survient, renvoyer une réponse avec les détails
      if (error) {
          console.error(`Erreur lors de l'exécution du script : ${error.message}`);
          console.error(`Sortie standard (stdout) : ${stdout}`);
          console.error(`Sortie d'erreur (stderr) : ${stderr}`);
          return res.status(500).json({
              message: 'Erreur lors de l\'arrêt du scénario.',
              error: error.message,
              stdout,
              stderr,
          });
      }

      // Si des messages sont présents dans stderr, les afficher mais ne pas les considérer comme des erreurs
      if (stderr) {
          console.warn(`Avertissement (stderr) : ${stderr}`);
      }

      console.log(`Sortie standard (stdout) : ${stdout}`);
      // Mettre à jour le fichier isrunning pour indiquer que le scénario est arrêté
      fs.writeFileSync(isRunningFilePath, '0', 'utf-8');

      // Envoyer une réponse de succès avec les messages de stdout
      res.json({
          message: `Scénario "${scenario}" arrêté avec succès.`,
          stdout: stdout.trim(), // Supprimer les espaces inutiles
      });
  });
};