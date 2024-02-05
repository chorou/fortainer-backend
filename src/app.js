// app.js
const express = require('express');
const http = require('http');
const os = require('os');
const dotenv = require('dotenv');
const fs = require('fs'); // Add the 'fs' module to read files


dotenv.config(); // Charge les variables d'environnement à partir du fichier .env

const app = express();

// Utilisez des variables d'environnement pour stocker des valeurs sensibles
let apiKey = '';
const dockerSocket = process.env.DOCKER_SOCKET || getDefaultDockerSocket();
const port = process.env.PORT || 3000;



// Fonction pour obtenir le chemin du socket Docker par défaut en fonction de la plateforme
function getDefaultDockerSocket() {
  return os.platform() === 'win32' ? '/\\.\/pipe\/docker_engine' : '/var/run/docker.sock';
}


// Read API key from the file synchronously
try {
  apiKey = fs.readFileSync('api-key.txt', 'utf8').trim(); // Read the file and trim whitespace
} catch (err) {
  console.error('Error reading API key file:', err);
  process.exit(1); // Exit the process if there's an error reading the file
}

// Middleware d'authentification
const authenticate = (req, res, next) => {
  const providedApiKey = req.headers['x-api-key'];

  if (!providedApiKey || providedApiKey !== apiKey) {
    return res.status(401).send('Unauthorized');
  }

  next();
};

// Middleware pour les requêtes vers /docker-api
app.use('/docker-api', authenticate, (req, res) => {
  let dockerPath = req.originalUrl.replace(/^\/docker-api/, '');
  dockerPath = dockerPath.endsWith('/') ? dockerPath.slice(0, -1) : dockerPath;

  const options = {
    socketPath: dockerSocket,
    path: req.originalUrl.replace(/^\/docker-api/, ''),
    method: req.method.toLowerCase(),
    headers: req.headers,
  };

  const clientRequest = http.request(options, (clientResponse) => {
    res.writeHead(clientResponse.statusCode, clientResponse.headers);
    clientResponse.pipe(res, { end: true });
  });

  clientRequest.on('error', (err) => {
    console.error('Error:', err);
    res.statusCode = 500;
    res.end('Error connecting to Docker Engine API');
  });

  req.pipe(clientRequest, { end: true });
});

// Démarrer le serveur
http.createServer(app).listen(port, () => {
  console.log(`Server running on port ${port}`);
});
