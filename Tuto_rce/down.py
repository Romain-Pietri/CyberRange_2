import subprocess
import sys
import os
# Vérifier si un argument a été passé pour le chemin du fichier docker-compose.yml
if len(sys.argv) < 2:
    print("Usage : python3 down.py <chemin-vers-docker-compose.yml>")
    sys.exit(1)
    
docker_compose_dir = sys.argv[1]

# Vérifier si le fichier docker-compose.yml existe dans le répertoire spécifié
if not os.path.exists(os.path.join(docker_compose_dir, "docker-compose.yml")):
    print(f"Erreur : Aucun fichier docker-compose.yml trouvé dans {docker_compose_dir}")
    sys.exit(1)
print(f"[+] docker-compose.yml trouvé dans {docker_compose_dir}")
print("[+] Arrets des conteneurs...")
os.chdir(docker_compose_dir)  # Changer le répertoire de travail
subprocess.run("docker-compose down", shell=True, check=True)
print("Container arreter avec succes")
