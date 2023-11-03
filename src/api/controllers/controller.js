// controller.js

const axios = require('axios');

// Fonction pour effectuer des requêtes à l'API Docker
async function makeDockerRequest(apiPath, options = {}) {
  try {
    const unixSocketPath = '/var/run/docker.sock';

    // Définir les options par défaut
    const defaultOptions = {
      socketPath: unixSocketPath,
      method: 'get',
    };

    const requestOptions = { ...defaultOptions, ...options };
    requestOptions.url = `http:${apiPath}`;

    const response = await axios(requestOptions);
    return response.data;
  } catch (error) {
    throw error;
  }
}
