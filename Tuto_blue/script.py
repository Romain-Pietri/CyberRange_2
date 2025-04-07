import subprocess
import sys
import time
import pg8000
import pymysql
import requests

# ---------------------- Récupération IP ----------------------

try:
    # TRUE_IP = subprocess.run("hostname -I", shell=True, capture_output=True, text=True).stdout.split()[0]
    TRUE_IP = "10.224.0.66"
    print(f"[+] IP détectée : {TRUE_IP}")
except Exception as e:
    print(f"[-] Erreur lors de la récupération de l'adresse IP : {e}")
    print("Veuillez spécifier l'adresse IP manuellement dans le script.")

# ---------------------- Installations Python ----------------------

def install_package(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    install_package("pg8000")
    install_package("pymysql")
    install_package("requests")
except Exception as e:
    print(f"[-] Erreur lors de l'installation des packages : {e}")
    sys.exit(1)

def run(cmd):
    subprocess.run(cmd, shell=True, check=True)

# ---------------------- Démarrage des conteneurs ----------------------

print("[+] Lancement des conteneurs...")
run("docker-compose down")
run("docker-compose build")
run("docker-compose up -d")



# ---------------------- Lancement de l'attaque ----------------------

print("[+] Lancement du script d'attaque...")
run("docker exec -d attacker python3 /attack.py")

# ---------------------- Connexion PostgreSQL ----------------------

print("[+] Configuration de Guacamole...")

DB_CONFIG = {
    "user": "guacamole_user",
    "password": "ChooseYourOwnPasswordHere1234",
    "database": "guacamole_db",
    "host": "localhost",
    "port": 5432
}

MAX_RETRIES = 20
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

# ---------------------- Initialisation de la base Guacamole ----------------------

print("[+] Initialisation de la base Guacamole depuis le fichier local...")

try:
    with open("init/initdb.sql", "r", encoding="utf-8") as f:
        sql_script = f.read()
except Exception as e:
    print(f"[-] Impossible de lire le fichier initdb.sql : {e}")
    sys.exit(1)

try:
    cursor.execute(sql_script)
    conn.commit()
    print("[+] Base Guacamole initialisée avec succès.")
except Exception as e:
    print(f"[-] Erreur lors de l'initialisation de la base : {e}")
    sys.exit(1)

# ---------------------- Ajout des connexions Guacamole ----------------------

VM_CONNECTIONS = [
    {"name": "Serveur SSH Blue Team", "hostname": TRUE_IP, "port": "2222", "protocol": "ssh", "username": "root", "password": "toor"},
    {"name": "Kali Blue 1", "hostname": TRUE_IP, "port": "3392", "protocol": "rdp", "username": "kaliuser", "password": "kali"},
    {"name": "Kali Blue 2", "hostname": TRUE_IP, "port": "3393", "protocol": "rdp", "username": "kaliuser", "password": "kali"},
    {"name": "Kali Blue 3", "hostname": TRUE_IP, "port": "3394", "protocol": "rdp", "username": "kaliuser", "password": "kali"}
]


print("[+] Nettoyage des anciennes connexions...")

cursor.execute("DELETE FROM guacamole_sharing_profile_parameter;")
cursor.execute("DELETE FROM guacamole_sharing_profile;")
cursor.execute("DELETE FROM guacamole_connection_permission;")
cursor.execute("DELETE FROM guacamole_connection_group_permission;")
cursor.execute("DELETE FROM guacamole_connection_group_attribute;")
cursor.execute("DELETE FROM guacamole_connection_attribute;")
cursor.execute("DELETE FROM guacamole_connection_group;")
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

    if vm["protocol"] == "ssh":
        parameters.append((connection_id, "color-scheme", "white-black"))

    cursor.executemany(
        "INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value) VALUES (%s, %s, %s)",
        parameters
    )

conn.commit()
cursor.close()
conn.close()

print("[+] Guacamole configuré avec succès ! Accès : http://localhost:8080/guacamole")

print("[+] Scénario tutoriel blue team prêt !")

# ---------------------- Attente infinie ----------------------

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("[+] Arrêt des conteneurs en cours...")
    run("docker-compose down")
    print("[+] Conteneurs arrêtés.")
