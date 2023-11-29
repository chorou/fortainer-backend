// services/dockerService.js
const axios = require('axios');

const unixSocketPath = '/var/run/docker.sock';

async function makeDockerRequest(apiPath, options = {}) {
  try {
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



async function getContainers() {
  try {
    const containersData = await makeDockerRequest('/containers/json');
    // Map the data to your model
    const containers = containersData.map(container => new Container(container.Id, container.Names[0], container.State));
    return containers;
  } catch (error) {
    throw error;
  }
}

async function getImages() {
  try {
    const imagesData = await makeDockerRequest('/images/json');
    // Map the data to your model
    const images = imagesData.map(image => new Image(image.Id, image.RepoTags[0], image.Size));
    return images;
  } catch (error) {
    throw error;
  }
}

async function getNetworks() {
  try {
    const networksData = await makeDockerRequest('/networks');
    // Map the data to your model
    const networks = networksData.map(network => new Network(network.Id, network.Name, network.Driver));
    return networks;
  } catch (error) {
    throw error;
  }
}

module.exports = { getContainers, getImages, getNetworks };
