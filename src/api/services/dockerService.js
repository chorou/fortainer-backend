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
