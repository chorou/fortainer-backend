const express = require('express');
const axios = require('axios');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Function to make Docker API requests
async function makeDockerRequest(apiPath, options = {}) {
  try {
    const unixSocketPath = '/var/run/docker.sock';

    // Define default options
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

/////////////////////////////////////// Route for containers ////////////////////////////

// Get information about all containers
app.get('/containers', async (req, res) => {
  try {
    const containers = await makeDockerRequest('/containers/json');
    res.json(containers);
  } catch (error) {
    // Handle errors and send appropriate status and message
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Route to create and start a container from a RepoTag
app.post('/containers', async (req, res) => {
  try {
    const { name, repoTag } = req.body;

    // Check if RepoTag is provided
    if (!repoTag) {
      throw new Error('RepoTag of Docker image not specified.');
    }

    // Use makeDockerRequest function to get the image ID from RepoTag
    const imageIdResponse = await makeDockerRequest(`/images/${repoTag}/json`, {
      method: 'get',
    });

    const imageId = imageIdResponse.Id;

    // Use the image ID to create the container
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

    res.json(createContainerResponse);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Delete a container
app.delete('/containers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Remove the specified container
    const removeContainerResponse = await makeDockerRequest(`/containers/${id}`, {
      method: 'delete',
    });

    res.json(removeContainerResponse);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

//////////////////////////////////// Route for images //////////////////////////////////

// Get information about all images
app.get('/images', async (req, res) => {
  try {
    const images = await makeDockerRequest('/images/json');
    res.json(images);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Pull an image from Docker Hub
app.post('/images', async (req, res) => {
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
});

// Delete an image
app.delete('/images/:id', async (req, res) => {
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
});

// Route to list RepoTags of existing Docker images
app.get('/images/list', async (req, res) => {
  try {
    // Use the makeDockerRequest function to retrieve the list of images with RepoTags
    const listImagesResponse = await makeDockerRequest('/images/json?all=0', {
      method: 'get',
    });

    // Extract RepoTags from the response
    const repoTags = listImagesResponse.map((image) => image.RepoTags).flat();

    // Send the response containing the list of repository tags
    res.json(repoTags);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Route to get an image by its ID
app.get('/images/:id', async (req, res) => {
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
});

///////////////////////////////////////// Route for networks /////////////////////////////

// Get information about all networks
app.get('/networks', async (req, res) => {
  try {
    const networks = await makeDockerRequest('/networks');
    res.json(networks);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Create a new network
app.post('/networks', async (req, res) => {
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
});

// Delete a network
app.delete('/networks/:id', async (req, res) => {
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
});

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
