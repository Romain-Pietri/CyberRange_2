import os
import sys
import subprocess
import time


print("Starting script...")
print("Current working directory:", os.getcwd())
print("Python version:", sys.version)

# Liste uniquement les dossiers dans le répertoire courant
files = [f for f in os.listdir(os.getcwd()) if os.path.isdir(f)]

print("Which Senario do you want to run?")
#print la liste des fichiers dans le dossier list
for i in range(len(files)):
    print(i+1, files[i])

#demande à l'utilisateur de choisir un fichier
while True:
    try:
        choice = int(input("Enter the number of the scenario you want to run: "))
        if 0 < choice <= len(files):
            break
        else:
            print("Invalid choice. Please try again.")
    except ValueError:
        print("Invalid input. Please enter a number.")
#choisi le fichier
file = files[choice-1]
print("You chose:", file)
print("Running scenario...")
#run le fichier "script.py" qui se trouve dans le dossier choisi
#cd dans le dossier
os.chdir(file)
#run le script
try:
    subprocess.run(["python3", "script.py"], check=True)
except subprocess.CalledProcessError as e:
    print(f"Error running script: {e}")
    sys.exit(1)
