import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { startScenario, listScenarios } from './scenarioManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Définir le moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir les fichiers statiques depuis le dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route pour afficher la page d'accueil avec la liste des scénarios
app.get('/', (req, res) => {
  const scenarios = listScenarios();
  res.render('index', { scenarios });
});

// Route pour démarrer un scénario spécifique
app.get('/start/:scenario', async (req, res) => {
  const { scenario } = req.params;
  try {
    const output = await startScenario(scenario);
    res.render('result', { scenario, output });
  } catch (err) {
    res.status(500).send(`Erreur lors du lancement du scénario ${scenario} : ${err.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
