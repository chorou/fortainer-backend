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

    const requestOptions = { ...defaultOptions, ...options };
    requestOptions.url = `http:${apiPath}`;

    const response = await axios(requestOptions);
    return response.data;
  } catch (error) {
    throw error;
  }
}



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
