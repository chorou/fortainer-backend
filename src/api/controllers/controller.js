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


// Contrôleur pour les routes des images
const imageController = {
  getImages: async (req, res) => {
    try {
      const images = await makeDockerRequest('/images/json');
      res.json(images);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },

  pullImage: async (req, res) => {
    try {
      const { imageName } = req.body;
      const pullImageResponse = await makeDockerRequest(`/images/create?fromImage=${imageName}`, {
        method: 'post',
      });

      res.json(pullImageResponse);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },

  deleteImage: async (req, res) => {
    try {
      const { id } = req.params;

      const removeImageResponse = await makeDockerRequest(`/images/${id}`, {
        method: 'delete',
      });

      res.json(removeImageResponse);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },

  listRepoTags: async (req, res) => {
    try {
      const listImagesResponse = await makeDockerRequest('/images/json?all=0', {
        method: 'get',
      });

      const repoTags = listImagesResponse.map((image) => image.RepoTags).flat();

      res.json(repoTags);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },

  getImageById: async (req, res) => {
    try {
      const { id } = req.params;

      const getImageResponse = await makeDockerRequest(`/images/${id}/json`, {
        method: 'get',
      });

      res.json(getImageResponse);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },
};


// Contrôleur pour les routes des réseaux
const networkController = {
  getNetworks: async (req, res) => {
    try {
      const networks = await makeDockerRequest('/networks');
      res.json(networks);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },

  createNetwork: async (req, res) => {
    try {
      const { name } = req.body;
      const createNetworkResponse = await makeDockerRequest('/networks/create', {
        method: 'post',
        data: {
          Name: name,
        },
      });

      res.json(createNetworkResponse);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },

  deleteNetwork: async (req, res) => {
    try {
      const { id } = req.params;

      const removeNetworkResponse = await makeDockerRequest(`/networks/${id}`, {
        method: 'delete',
      });

      res.json(removeNetworkResponse);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },
};

module.exports = {
  containerController,
  imageController,
  networkController,
};


