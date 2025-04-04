import subprocess
import sys
import time
import pg8000

try :
    TRUE_IP = subprocess.run("hostname -I", shell=True, capture_output=True, text=True).stdout.split()[0]
    print(TRUE_IP)
except Exception as e:
    print(f"Erreur lors de la récupération de l'adresse IP : {e}")
    print("Veuillez spécifier l'adresse IP de votre machine manuellement. ( Ligne 50)")
    sys.exit(1)

# Adresse IP de la machine hôte
#TRUE_IP = ""     

def install_package(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    install_package("pg8000")
except Exception as e:
    print(f"Erreur lors de l'installation de pg8000 : {e}")
    sys.exit(1)

def run(cmd):
    subprocess.run(cmd, shell=True, check=True)

print("[+] Lancement des conteneurs...")
run("docker-compose down")
run("docker-compose up -d")

print("[+] Configuration de Guacamole...")

DB_CONFIG = {
    "user": "guacamole_user",
    "password": "ChooseYourOwnPasswordHere1234",
    "database": "guacamole_db",
    "host": "localhost",
    "port": 5432
}

# Attendre que PostgreSQL soit prêt
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
    print("Échec définitif de connexion à PostgreSQL.")
    sys.exit(1)

# Configurer les VMs avec IP valide
VM_CONNECTIONS = [
    {"name": "Kali Blue 1", "hostname": TRUE_IP, "port": "3389"},
    {"name": "Kali Blue 2", "hostname": TRUE_IP, "port": "3390"},
    {"name": "Kali Blue 3", "hostname": TRUE_IP, "port": "3391"},
]

# Réinitialisation des connexions Guacamole
cursor.execute("DELETE FROM guacamole_connection_parameter;")
cursor.execute("DELETE FROM guacamole_connection;")
conn.commit()

for vm in VM_CONNECTIONS:
    cursor.execute(
        "INSERT INTO guacamole_connection (connection_name, protocol) VALUES (%s, %s) RETURNING connection_id",
        (vm["name"], "rdp"),
    )
    connection_id = cursor.fetchone()[0]

    parameters = [
        (connection_id, "hostname", vm["hostname"]),
        (connection_id, "port", vm["port"]),
        (connection_id, "username", "kaliuser"),
        (connection_id, "password", "kali"),
        (connection_id, "ignore-cert", "true"),
        (connection_id, "security", "any")
    ]

    cursor.executemany(
        "INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value) VALUES (%s, %s, %s)",
        parameters
    )

conn.commit()
cursor.close()
conn.close()

print("[+] Guacamole configuré avec succès ! Accès : http://localhost:8080/guacamole")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("[+] Arrêt des conteneurs en cours...")
    run("docker-compose down")
    print("[+] Conteneurs arrêtés.")
