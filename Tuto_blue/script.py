import subprocess
import sys
import time
import pg8000
import pymysql
import requests
import re


# Votre IP de référence
TRUE_IP = "192.168.1.152"

try :
    #TRUE_IP = subprocess.run("hostname -I", shell=True, capture_output=True, text=True).stdout.split()[0]
    
    print(TRUE_IP)
except Exception as e:
    print(f"Erreur lors de la récupération de l'adresse IP : {e}")
    print("Veuillez spécifier l'adresse IP de votre machine manuellement. ( Ligne 50)")
    sys.exit(1)



# ---------------------- Installations python3----------------------

def install_package(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])


try:
    install_package("pg8000")
    install_package("pymysql")
    install_package("requests")
except Exception as e:
    print(f"Erreur lors de l'installation des packages : {e}")
    #sys.exit(1)

def run(cmd):
    subprocess.run(cmd, shell=True, check=True)

# ---------------------- Démarrage des conteneurs ----------------------
import os
import json
# Vérifier si un argument a été passé pour le chemin du fichier docker-compose.yml
if len(sys.argv) < 2:
    print("Usage : python3script.py <chemin-vers-docker-compose.yml>")
    sys.exit(1)

docker_compose_dir = sys.argv[1]

# Vérifier si le fichier docker-compose.yml existe dans le répertoire spécifié
if not os.path.exists(os.path.join(docker_compose_dir, "docker-compose.yml")):
    print(f"Erreur : Aucun fichier docker-compose.yml trouvé dans {docker_compose_dir}")
    #sys.exit(1)
print(f"[+] docker-compose.yml trouvé dans {docker_compose_dir}")
print("[+] Lancement des conteneurs...")
try :
    
    os.chdir(docker_compose_dir)  # Changer le répertoire de travail
    #run("docker-compose down")
    #run("docker-compose build")
    #run("docker-compose up -d")
except Exception as e:
    print(f"Erreur lors du démarrage des conteneurs : {e}")
    sys.exit(1)
# ---------------------- Configuration de Guacamole ----------------------

print("[+] Configuration de Guacamole...")

DB_CONFIG = {
    "user": "guacamole_user",
    "password": "ChooseYourOwnPasswordHere1234",
    "database": "guacamole_db",
    "host": "localhost",
    "port": 5432
}

# Charger les connexions depuis un fichier JSON
try:
    with open("vm_connections.json", "r") as file:
        VM_CONNECTIONS = json.load(file)
except FileNotFoundError:
    print("Erreur : Le fichier 'vm_connections.json' est introuvable.")
    sys.exit(1)
except json.JSONDecodeError as e:
    print(f"Erreur : Le fichier 'vm_connections.json' contient une erreur de format JSON : {e}")
    sys.exit(1)
#remplace les valeur $ par TRUE_IP 
for vm in VM_CONNECTIONS:
    for key, value in vm.items():
        if isinstance(value, str) and "$" in value:
            vm[key] = value.replace("$", TRUE_IP)

MAX_RETRIES = 10
for attempt in range(MAX_RETRIES):
    try:
        conn = pg8000.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("[+] Connexion à PostgreSQL réussie !")
        break
    except Exception as e:
        print(f"[+] PostgreSQL non prêt, essai {attempt+1}/{MAX_RETRIES}. Attente 5s...")
        time.sleep(5)
else:
    print("[-] Échec de connexion à PostgreSQL.")
    sys.exit(1)



cursor.execute("DELETE FROM guacamole_connection_parameter;")
cursor.execute("DELETE FROM guacamole_connection;")
conn.commit()

for vm in VM_CONNECTIONS:
    cursor.execute(
        "INSERT INTO guacamole_connection (connection_name, protocol) VALUES (%s, %s) RETURNING connection_id",
        (vm["name"], vm["protocol"]),
    )
    connection_id = cursor.fetchone()[0]

    parameters = [
        (connection_id, "hostname", vm["hostname"]),
        (connection_id, "port", vm["port"]),
        (connection_id, "username", vm["username"]),
        (connection_id, "password", vm["password"]),
    ]

    if vm["protocol"] == "rdp":
        parameters += [
            (connection_id, "ignore-cert", "true"),
            (connection_id, "security", "any"),
        ]

    cursor.executemany(
        "INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value) VALUES (%s, %s, %s)",
        parameters
    )

conn.commit()
cursor.close()
conn.close()

print("[+] Guacamole configuré avec succès ! Accès : http://localhost:8080/guacamole")

print("[+] Scénario tutoriel kali red Prêt !")
