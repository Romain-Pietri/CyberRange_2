
# Fiche Technique – CyberRange

## 🔖 Informations Générales

- **Nom du projet :** CyberRange  
- **Description :** Plateforme de simulation dédiée à l’entraînement à la cybersécurité, basée sur Docker Compose. Elle permet le déploiement automatisé de machines virtuelles vulnérables dans le cadre de scénarios prédéfinis.

---

## 🧰 Prérequis

### Logiciels requis

- **Système d’exploitation hôte :** Linux  
- **Docker**  
- **Docker Compose**  
- **Python**  
- **pip**  
- **Node.js**

---

## ⚙️ Installation

### 1. Clonage du dépôt

```bash
git clone https://github.com/Romain-Pietri/CyberRange_2.git
cd CyberRange_2
```

### 2. Installation de Docker et Docker Compose

#### Docker
```bash
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

> Redémarrer la session pour appliquer les modifications de groupe.

#### Docker Compose
```bash
sudo apt install docker-compose -y
```

---

## 🗂 Structure du projet

```bash
CyberRange_2
├── Web
│   ├── backend
│   │   ├── src
│   │   │   ├── controllers
│   │   │   ├── models
│   │   │   ├── routes
│   │   │   ├── utils
│   │   │   └── index.js
│   │   ├── package.json
│   │   └── package-lock.json
│   └── frontend
│       ├── public
│       ├── src
│       ├── package.json
│       └── package-lock.json
├── Scénario_Exemple
│   ├── docker-compose.yml
│   ├── README.md
│   ├── script.py
│   ├── Dockerfile
│   ├── Dockerfile2
│   ├── Data
│   ├── Isrunning
│   ├── down.py
│   ├── vm_connections.json
│   └── README.md
└── README.md
```

---

## 🚀 Déploiement

### Lancement du frontend

```bash
cd Web/frontend
npm install
npm start
```

### Lancement du backend

```bash
cd Web/backend
node src/index.js
```

---

## 🛡️ Utilisation

### Connexion à l’interface

- **Identifiant :** `admin`  
- **Mot de passe :** `password`

![Connexion](Readme/img/connexion.png)

---

### Interface d’accueil

![Accueil](Readme/img/accueil.png)

---

### Gestion des machines virtuelles

![Gestion VM](Readme/img/Gestion.png)

---

### Lancement d’un scénario (exemple : `Tuto_rce`)

---

## ⚙️ Fonctionnement Technique

Le lancement d’un scénario repose sur une chaîne automatisée pilotée par une API :

- L’API **`/start`** est appelée pour initier le scénario.
- Cette action déclenche le fichier **`script.py`** du scénario.
- Ce script :
  - **build** et **lance** les services définis dans le fichier **`docker-compose.yml`**,
  - se connecte à la **base de données** pour y enregistrer les machines déployées, accessibles ensuite via **Guacamole** (interface web d’accès distant).

---

## 🌐 Connexion à Guacamole

- **Identifiant :** `Guacadmin`  
- **Mot de passe :** `Guacadmin`

![Connexion Guac](Readme/img/guacadmin.png)  
![Sélection du scénario](Readme/img/guacamole.png)  
![Démarrage de la machine](Readme/img/Machine.png)

---

### Suppression d’un scénario

![Suppression](Readme/img/supprimer.png)

- **Route :** `/delete`  
- Supprime le dossier du scénario.

---

### Ajout d’un scénario

![Ajout - Nom](Readme/img/Ajouter-nom.png)  
![Ajout - Succès](Readme/img/ajout%20succés.png)

#### Technique

- **Route :** `/create-scenario`  
- Copie les fichiers contenus dans `/controllers/model` dans le nouveau dossier du scénario.

---

### Modification d’un scénario

- Définition du nombre d’**attaquants** et de **défenseurs**  
- Activation du **SIEM** (optionnelle)  
- Ajout de **machines**, **réseaux** ou documentation **README**

![Modifier](Readme/img/modifier.png)

---

## 🧩 Configuration réseau

- **Nom du réseau**  
- **Masque de sous-réseau** (ex : `192.168.1.0/24`)

![Réseau](Readme/img/modifier1.png)

---

## 🖥️ Configuration des machines

- **Nom de la machine**  
- **Système d’exploitation**  
- **Identifiants (login / mot de passe)**  
- **Ouverture de ports**  
- **Association à un réseau**

![Machines](Readme/img/modifier2.png)

---

## 📘 Ajout de documentation (README)

![README](Readme/img/modifier3.png)

---

## ⚙️ Fonctionnement Technique de l’interface

### Ajout de machines (attaquantes ou défensives)

- Ajoute la machine dans le `docker-compose.yml` du scénario.
- Enregistre la machine dans `vm_connections.json`.
- Incrémente les ports pour éviter les conflits.

### Ajout de réseaux

- Ajoute le réseau dans le fichier `docker-compose.yml`.

---

## ⚠️ Limitations connues

- Le nombre de machines virtuelles est limité à **10** par scénario.  
- Les machines **Windows** ne sont pas encore prises en charge.  
- Le **serveur hôte ne peut pas être sous Windows** (incompatibilités liées aux chemins de fichiers et à la récupération des adresses IP).  
- Les **noms de machines contenant des espaces** ne sont pas supportés.

---

## 🔌 Fonctionnement de l’API

### Création d’un scénario

- **Route :** `/create-scenario`  
- **Méthode :** POST  
- **Description :** Crée un nouveau scénario avec les fichiers nécessaires.

#### Requête (JSON)
```json
{
  "scenarioName": "exampleScenario"
}
```

#### Réponses possibles
- ✅ 201 : Scénario créé  
- ❌ 400 : Champs manquants ou scénario déjà existant  
- ❌ 500 : Erreur serveur

---

### Récupération d’un scénario

- **Route :** `/get-scenario`  
- **Méthode :** POST  
- **Description :** Récupère les fichiers d’un scénario existant.

#### Requête (JSON)
```json
{
  "scenarioName": "exampleScenario"
}
```

#### Réponses possibles
- ✅ 200 : Contenu retourné  
- ❌ 404 : Scénario ou fichier introuvable

---

### Mise à jour d’un scénario

- **Route :** `/update`  
- **Méthode :** POST  
- **Description :** Met à jour les informations d’un scénario existant.

#### Requête (JSON)
```json
{
  "scenarioName": "exampleScenario",
  "NbRed": 2,
  "NbBlue": 3,
  "BoolSiem": true,
  "dockerComposeJson": {
    "services": {
      "service1": { "image": "nginx" },
      "service2": { "image": "redis" }
    },
    "volumes": {
      "volume1": {}
    }
  }
}
```

#### Réponses possibles
- ✅ 200 : Mise à jour réussie  
- ❌ 404 : Scénario introuvable  
- ❌ 500 : Erreur serveur

---

### Upload de fichiers

- **Route :** `/upload-file`  
- **Méthode :** POST  
- **Description :** Crée ou met à jour un fichier dans un scénario.

#### Requête (JSON)
```json
{
  "scenarioName": "exampleScenario",
  "file": "Contenu du fichier à écrire",
  "pathFile": "subdir1/subdir2/",
  "nameFile": "Dockerfile"
}
```

#### Réponses possibles
- ✅ 200 : Fichier traité  
- ❌ 404 : Scénario introuvable  
- ❌ 500 : Erreur serveur

