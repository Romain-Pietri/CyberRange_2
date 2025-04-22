import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Recréer __filename et __dirname dans le contexte des modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scenariosDir = path.resolve(__dirname, '..');

// Fonction pour lister tous les scénarios disponibles
export function listScenarios() {
  return fs.readdirSync(scenariosDir).filter((file) => {
    const scenarioPath = path.join(scenariosDir, file);
    return fs.statSync(scenarioPath).isDirectory() && fs.existsSync(path.join(scenarioPath, 'script.py'));
  });
}

// Fonction pour démarrer un scénario spécifique
export async function startScenario(name) {
  const scenarios = listScenarios();
  if (!scenarios.includes(name)) {
    throw new Error(`Scénario "${name}" non trouvé.`);
  }

  const scenarioPath = path.join(scenariosDir, name, 'script.py');
  const command = `python3 ${scenarioPath}`;

  console.log(`Lancement du scénario : ${command}`);
  const { stdout, stderr } = await execAsync(command);
  if (stderr) {
    console.error(`Erreur lors de l'exécution du script : ${stderr}`);
  }
  console.log(`Sortie du script : ${stdout}`);
}
