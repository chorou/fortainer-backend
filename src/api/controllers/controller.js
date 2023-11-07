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




// Contrôleur pour les routes des conteneurs
const containerController = {
  getContainers: async (req, res) => {
    try {
      const containers = await makeDockerRequest('/containers/json');
      res.json(containers);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },

  createContainer: async (req, res) => {
    try {
      const { name, repoTag } = req.body;

      if (!repoTag) {
        throw new Error('RepoTag de l\'image Docker non spécifié.');
      }

      const imageIdResponse = await makeDockerRequest(`/images/${repoTag}/json`, {
        method: 'get',
      });

      const imageId = imageIdResponse.Id;

      const createContainerResponse = await makeDockerRequest('/containers/create', {
        method: 'post',
        data: {
          name,
          Image: imageId,
        },
      });

      const startContainerResponse = await makeDockerRequest(`/containers/${createContainerResponse.Id}/start`, {
        method: 'post',
      });

      res.json(createContainerResponse);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },

  deleteContainer: async (req, res) => {
    try {
      const { id } = req.params;

      const removeContainerResponse = await makeDockerRequest(`/containers/${id}`, {
        method: 'delete',
      });

      res.json(removeContainerResponse);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },
};

