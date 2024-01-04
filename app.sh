#!/bin/bash

# Script d'installation pour l'application Fortainer

# 1. Installation de Node.js
echo "Installation de Node.js..."
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
echo "Node.js installé avec succès."

# 2. Génération de la clé pour l'application
echo "Génération de la clé pour l'application..."
openssl genrsa -out app.key 2048
echo "Clé générée avec succès."

# 3. Installation de Docker (si Docker n'est pas déjà installé)
if ! command -v docker &> /dev/null; then
    echo "Installation de Docker..."
    sudo apt-get update
    sudo apt-get install -y docker.io
    sudo usermod -aG docker $USER
    echo "Docker installé avec succès."
else
    echo "Docker est déjà installé."
fi

# 4. Configuration de l'application
echo "Configuration de l'application..."
# Assurez-vous d'ajuster les paramètres de configuration selon les besoins de votre application

# 5. Installation des dépendances Node.js
echo "Installation des dépendances Node.js..."
npm install
echo "Dépendances installées avec succès."

# 6. Démarrage de l'application
echo "Démarrage de l'application..."
npm start
echo "L'application est maintenant en cours d'exécution."
