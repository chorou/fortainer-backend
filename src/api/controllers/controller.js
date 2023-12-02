// controller.js

const axios = require('axios');

// Function to make requests to the Docker API
async function makeDockerRequest(apiPath, options = {}) {
  try {
    // Define the Unix socket path for Docker API
    const unixSocketPath = '/var/run/docker.sock';

    // Set default options
    const defaultOptions = {
      socketPath: unixSocketPath,
      method: 'get',
    };

    // Merge default options with user-provided options
    const requestOptions = { ...defaultOptions, ...options };
    // Set the complete API URL
    requestOptions.url = `http:${apiPath}`;

    // Make the request using Axios
    const response = await axios(requestOptions);
    return response.data;
  } catch (error) {
    // Throw any errors that occur during the request
    throw error;
  }
}

// Controller for container routes
const containerController = {
  // Get information about all containers
  getContainers: async (req, res) => {
    try {
      const containers = await makeDockerRequest('/containers/json');
      res.json(containers);
    } catch (error) {
      // Handle errors and send appropriate status and message
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },

  // Create a new container
  createContainer: async (req, res) => {
    try {
      const { name, repoTag } = req.body;

      if (!repoTag) {
        throw new Error('Docker image RepoTag not specified.');
      }

      // Get image ID based on RepoTag
      const imageIdResponse = await makeDockerRequest(`/images/${repoTag}/json`, {
        method: 'get',
      });

      const imageId = imageIdResponse.Id;

      // Create a new container using the specified image
      const createContainerResponse = await makeDockerRequest('/containers/create', {
        method: 'post',
        data: {
          name,
          Image: imageId,
        },
      });

      // Start the created container
      const startContainerResponse = await makeDockerRequest(`/containers/${createContainerResponse.Id}/start`, {
        method: 'post',
      });

      // Send the response containing information about the created container
      res.json(createContainerResponse);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },

  // Delete a container
  deleteContainer: async (req, res) => {
    try {
      const { id } = req.params;

      // Remove the specified container
      const removeContainerResponse = await makeDockerRequest(`/containers/${id}`, {
        method: 'delete',
      });

      // Send the response containing information about the removed container
      res.json(removeContainerResponse);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },
};

// Controller for image routes
const imageController = {
  // Get information about all images
  getImages: async (req, res) => {
    try {
      const images = await makeDockerRequest('/images/json');
      res.json(images);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },

  // Pull an image from Docker Hub
  pullImage: async (req, res) => {
    try {
      const { imageName } = req.body;
      // Pull the specified image
      const pullImageResponse = await makeDockerRequest(`/images/create?fromImage=${imageName}`, {
        method: 'post',
      });

      // Send the response containing information about the pulled image
      res.json(pullImageResponse);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },

  // Delete an image
  deleteImage: async (req, res) => {
    try {
      const { id } = req.params;

      // Remove the specified image
      const removeImageResponse = await makeDockerRequest(`/images/${id}`, {
        method: 'delete',
      });

      // Send the response containing information about the removed image
      res.json(removeImageResponse);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },

  // List repository tags for images
  listRepoTags: async (req, res) => {
    try {
      // Get information about all images with a specific format
      const listImagesResponse = await makeDockerRequest('/images/json?all=0', {
        method: 'get',
      });

      // Extract and flatten RepoTags from the response
      const repoTags = listImagesResponse.map((image) => image.RepoTags).flat();

      // Send the response containing the list of repository tags
      res.json(repoTags);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },

  // Get information about an image by ID
  getImageById: async (req, res) => {
    try {
      const { id } = req.params;

      // Get information about the image with the specified ID
      const getImageResponse = await makeDockerRequest(`/images/${id}/json`, {
        method: 'get',
      });

      // Send the response containing information about the image
      res.json(getImageResponse);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },
};

// Controller for network routes
const networkController = {
  // Get information about all networks
  getNetworks: async (req, res) => {
    try {
      const networks = await makeDockerRequest('/networks');
      res.json(networks);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },

  // Create a new network
  createNetwork: async (req, res) => {
    try {
      const { name } = req.body;
      // Create a new network with the specified name
      const createNetworkResponse = await makeDockerRequest('/networks/create', {
        method: 'post',
        data: {
          Name: name,
        },
      });

      // Send the response containing information about the created network
      res.json(createNetworkResponse);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },

  // Delete a network
  deleteNetwork: async (req, res) => {
    try {
      const { id } = req.params;

      // Remove the specified network
      const removeNetworkResponse = await makeDockerRequest(`/networks/${id}`, {
        method: 'delete',
      });

      // Send the response containing information about the removed network
      res.json(removeNetworkResponse);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  },
};

// Export the controllers for use in other parts of the application
module.exports = {
  containerController,
  imageController,
  networkController,
};
