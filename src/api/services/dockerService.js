// dockerService.js
const axios = require('axios');

const unixSocketPath = '/var/run/docker.sock';

const jwt = require('jsonwebtoken')


async function makeDockerRequest(apiPath, options = {}) {
  try {
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

async function getContainers() {
  try {
    const containersData = await makeDockerRequest('/containers/json');
    // Map the data to your model
    const containers = containersData.map(container => ({
      id: container.Id,
      name: container.Names[0],
      state: container.State,
    }));
    return containers;
  } catch (error) {
    throw error;
  }
}

async function createContainer(name, repoTag) {
  try {
    if (!repoTag) {
      throw new Error('RepoTag of Docker image not specified.');
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

    return createContainerResponse;
  } catch (error) {
    throw error;
  }
}

async function removeContainer(id) {
  try {
    const removeContainerResponse = await makeDockerRequest(`/containers/${id}`, {
      method: 'delete',
    });

    return removeContainerResponse;
  } catch (error) {
    throw error;
  }
}

async function getImages() {
  try {
    const imagesData = await makeDockerRequest('/images/json');
    // Map the data to your model
    const images = imagesData.map(image => ({
      id: image.Id,
      repoTag: image.RepoTags[0],
      size: image.Size,
    }));
    return images;
  } catch (error) {
    throw error;
  }
}

async function pullImage(imageName) {
  try {
    const pullImageResponse = await makeDockerRequest(`/images/create?fromImage=${imageName}`, {
      method: 'post',
    });

    return pullImageResponse;
  } catch (error) {
    throw error;
  }
}

async function removeImage(id) {
  try {
    const removeImageResponse = await makeDockerRequest(`/images/${id}`, {
      method: 'delete',
    });

    return removeImageResponse;
  } catch (error) {
    throw error;
  }
}

async function getNetworks() {
  try {
    const networksData = await makeDockerRequest('/networks');
    // Map the data to your model
    const networks = networksData.map(network => ({
      id: network.Id,
      name: network.Name,
      driver: network.Driver,
    }));
    return networks;
  } catch (error) {
    throw error;
  }
}

async function createNetwork(name) {
  try {
    const createNetworkResponse = await makeDockerRequest('/networks/create', {
      method: 'post',
      data: {
        Name: name,
      },
    });

    return createNetworkResponse;
  } catch (error) {
    throw error;
  }
}

async function removeNetwork(id) {
  try {
    const removeNetworkResponse = await makeDockerRequest(`/networks/${id}`, {
      method: 'delete',
    });

    return removeNetworkResponse;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getContainers,
  createContainer,
  removeContainer,
  getImages,
  pullImage,
  removeImage,
  getNetworks,
  createNetwork,
  removeNetwork,
};
