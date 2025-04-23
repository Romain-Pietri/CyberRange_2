# Fiche Technique – CyberRange_2

## 🔖 Informations Générales

- **Nom du projet :** CyberRange_2  
- **Description :** Plateforme de simulation pour entraînement à la cybersécurité, basée sur docker compose. Elle permet le déploiement automatisé de machines virtuelles vulnérables pour des scénarios prédéfinis
---

## Prérequis

### Logiciels
- **Système hôte :** Linux (Ubuntu/Debian recommandé)
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

# Docker
``sudo systemctl enable docker``

``sudo usermod -aG docker $USER``

# Docker Compose
``sudo apt install docker-compose -y``

### Deploiement du front

``cd Web\frontend``

``npm install``

``npm start``

### Deploiement du back

``cd Web\backend\src``

``node index.js``