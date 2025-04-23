# Fiche Technique – CyberRange_2

## 🔖 Informations Générales

- **Nom du projet :** CyberRange_2  
- **Description :** Plateforme de simulation pour entraînement à la cybersécurité, basée sur docker compose. Elle permet le déploiement automatisé de machines virtuelles vulnérables pour des scénarios prédéfinis
---

## Prérequis

### Logiciels
- **Système hôte :** Linux
- **Docker**
- **Python**
- **pip**
- **node**
---

## ⚙️ Installation & Mise

### Cloner le dépot
``git clone https://github.com/Romain-Pietri/CyberRange_2.git``

``cd CyberRange_2``

### Installer docker et docker compose

#### Docker
``sudo systemctl enable docker``

``sudo usermod -aG docker $USER``

#### Docker Compose
``sudo apt install docker-compose -y``

#### Deploiement du front

``cd Web\frontend``

``npm install``

``npm start``

#### Deploiement du back

``cd Web\backend\src``

``node index.js``


## 🛡️​ ​Utilisation 🏹

### Connexion

- **Identifiant** : admin

- **Mot de Passe** : password

![Connexion](Readme/img/connexion.png)

### Page d'acceuil

![Accueil](Readme/img/accueil.png)

### Gestion des Machines Virtuelles

![Gestion VM](Readme/img/Gestion.png)

### Lancer un scénario (Exemple Tuto_rce)

- **Identifiant** : Guacadmin 
- **Mot de Passe** : Guacadmin 
![Connexion](Readme/img/guacadmin.png)
![Lancer](Readme/img/guacamole.png)
![Machine](Readme/img/Machine.png)

### Supprimer Scénarios

![Supprimer Scénario](Readme/img/supprimer.png)

### Ajouter Scénarios

![Nom Scénario](Readme/img/Ajouter-nom.png)
![Succès Ajout](Readme/img/ajout%20succés.png)

### Modifier Scénarios

- **Choix Nombre attaquant et défenseurs**
- **SIEM ou non**
- **Possibilité de rajouter des machines / réseaux ou readme**

![Modifier Scénario](Readme/img/modifier.png)

# Configuration Réseau

- **Nom du réseau**
- **Masque de sous-réseau**

![Modifier Scénario 1](Readme/img/modifier1.png)

# Configuration Machines 

- **Nom de la machine**
- **Choix de l'OS**
- **Identifiant et Mot de passe**
- **Possibiité d'ouvrir des ports**
- **Affilié la machine à un réseau**

![Modifier Scénario 2](Readme/img/modifier2.png)

# Configuration ReadMe

![Modifier Scénario 3](Readme/img/modifier3.png)

