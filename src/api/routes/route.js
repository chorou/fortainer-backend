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



///////////////////////////////////////Route for containers////////////////////////////

app.get('/containers', async (req, res) => {
  try {
    const containers = await makeDockerRequest('/containers/json');
    res.json(containers);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Route pour créer et démarrer un conteneur à partir d'un RepoTag
app.post('/containers', async (req, res) => {
  try {
    const { name, repoTag } = req.body;

    // Vérifiez si le RepoTag est fourni
    if (!repoTag) {
      throw new Error('RepoTag de l\'image Docker non spécifié.');
    }

    // Utilisez la fonction makeDockerRequest pour obtenir l'ID de l'image à partir du RepoTag
    const imageIdResponse = await makeDockerRequest(`/images/${repoTag}/json`, {
      method: 'get',
    });

    const imageId = imageIdResponse.Id;

    // Utilisez l'ID de l'image pour créer le conteneur
    const createContainerResponse = await makeDockerRequest('/containers/create', {
      method: 'post',
      data: {
        name,
        Image: imageId,
      },
    });

    // Démarrer le conteneur créé
    const startContainerResponse = await makeDockerRequest(`/containers/${createContainerResponse.Id}/start`, {
      method: 'post',
    });

    res.json(createContainerResponse);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});



app.delete('/containers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const removeContainerResponse = await makeDockerRequest(`/containers/${id}`, {
      method: 'delete',
    });

    res.json(removeContainerResponse);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});



//////////////////////////////////// Route for images//////////////////////////////////

app.get('/images', async (req, res) => {
  try {
    const images = await makeDockerRequest('/images/json');
    res.json(images);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.post('/images', async (req, res) => {
  try {
    const { imageName } = req.body;
    const pullImageResponse = await makeDockerRequest(`/images/create?fromImage=${imageName}`, {
      method: 'post',
    });

    res.json(pullImageResponse);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.delete('/images/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const removeImageResponse = await makeDockerRequest(`/images/${id}`, {
      method: 'delete',
    });

    res.json(removeImageResponse);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});


// Route pour lister les RepoTags des images Docker existantes
app.get('/images/list', async (req, res) => {
  try {
    // Utilisez la fonction makeDockerRequest pour récupérer la liste des images avec les RepoTags
    const listImagesResponse = await makeDockerRequest('/images/json?all=0', {
      method: 'get',
    });

    // Extrait les RepoTags de la réponse
    const repoTags = listImagesResponse.map((image) => image.RepoTags).flat();

    res.json(repoTags);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});



// Route pour récupérer une image par son ID
app.get('/images/:id', async (req, res) => {
  try {
    const { id } = req.params;

   const getImageResponse = await makeDockerRequest(`/images/${id}/json`, {
      method: 'get',
    });

    res.json(getImageResponse);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
