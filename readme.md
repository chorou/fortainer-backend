# Docker API Express Server

This is a simple Express server that interacts with the Docker API to manage containers, images, and networks. The `makeDockerRequest` function simplifies Docker API requests in environments using a UNIX socket. It uses Axios to make HTTP requests to the Docker API via the UNIX socket `/var/run/docker.sock`. This function takes the API path and optional configuration options as parameters. In case of success, it returns the response data, and in case of an error, it throws an exception.

## `makeDockerRequest` Function

The `makeDockerRequest` function has been created to simplify requests to the Docker API in environments using a UNIX socket. It uses Axios to make HTTP requests to the Docker API via the UNIX socket `/var/run/docker.sock`. This function takes the API path and optional configuration options as parameters. In case of success, it returns the response data, and in case of an error, it throws an exception.

### Usage

1. **Install Axios:**

   Ensure that Axios is installed in your project:

   ```bash
   npm install axios
   ```

2. **Import the Function:**

   In your Node.js file, import the `makeDockerRequest` function:

   ```javascript
   const makeDockerRequest = require('./path/to/makeDockerRequest');
   ```

3. **Make a Docker Request:**

   Use the function by specifying the Docker API path and optionally configuration options:

   ```javascript
   const apiPath = '/containers/json';

   makeDockerRequest(apiPath, { method: 'get', headers: { 'Content-Type': 'application/json' } })
     .then((data) => {
       console.log('Docker API Response:', data);
     })
     .catch((error) => {
       console.error('Error during Docker request:', error.message);
     });
   ```

4. **Explanation of the Function Logic:**

   Here's a breakdown of the function logic:

   - **Default Options:**
     - The function starts by defining default options, including the UNIX socket path (`/var/run/docker.sock`) and the HTTP method (default is 'get').

   - **Options Merging:**
     - Provided options are merged with the default options using the spread operator.

   - **URL Construction:**
     - The full API URL is constructed by adding the `apiPath` to the `http:` protocol.

   - **Axios Request:**
     - Axios is used to make an HTTP request to the Docker API with the constructed options.

   - **Data Return:**
     - In case of success, the function returns the response data.

   - **Error Handling:**
     - In case of an error, the function throws an exception that the calling code can catch and handle.

5. **Adjust the API Path:**

   Understand the Docker API endpoints and adjust the `apiPath` according to your specific needs.

By following these steps, you can easily integrate and use the `makeDockerRequest` function in your Node.js project to interact with the Docker API.

## Prerequisites

Make sure you have the following installed:

- Node.js
- Docker (running and accessible)

## Architecture

![Alt text](/postman_screens/diagram.png)


## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will be running on http://localhost:3000.

## Testing Routes with Postman

### Containers

#### 1. Get Containers

- **Endpoint:** GET http://localhost:3000/containers
- **Expected Result:**
  - Status: 200 OK
  - Response Body: List of Docker containers
  ![Alt text](get_containers.png)

#### 2. Create Container

- **Endpoint:** POST http://localhost:3000/containers
- **Request Body:**
  ```json
  {
    "name": "new-container",
    "repoTag": "nginx:latest"
  }
  ```
- **Expected Result:**
  - Status: 200 OK
  - Response Body: Information about the created container

  ![Alt text](/postman_screens/create_container.png)

#### 3. Delete Container

- **Endpoint:** DELETE http://localhost:3000/containers/:id
- **Expected Result:**
  - Status: 200 OK
  - Response Body: Information about the removed container

  ![Alt text](/postman_screens/delete_container.png)
### Images

#### 1. Get Images

- **Endpoint:** GET http://localhost:3000/images
- **Expected Result:**
  - Status: 200 OK
  - Response Body: List of Docker images

  ![Alt text](/postman_screens/get_images.png)

#### 2. Pull Image

- **Endpoint:** POST http://localhost:3000/images
- **Request Body:**
  ```json
  {
    "imageName": "nginx:latest"
  }
  ```
  ![Alt text](/postman_screens/pull_image.png)
- **Expected Result:**
  - Status: 200 OK
  - Response Body: Information about the pulled image

#### 3. Delete Image

- **Endpoint:** DELETE http://localhost:3000/images/:id
- **Expected Result:**
  - Status: 200 OK
  - Response Body: Information about the removed image

  ![Alt text](/postman_screens/delete_image.png)

#### 4. List RepoTags

- **Endpoint:** GET http://localhost:3000/images/list
- **Expected Result:**
  - Status: 200 OK
  - Response Body: List of repository tags for existing

 Docker images

 ![Alt text](/postman_screens/get_list_image.png)

#### 5. Get Image by ID

- **Endpoint:** GET http://localhost:3000/images/:id
- **Expected Result:**
  - Status: 200 OK
  - Response Body: Information about the specified image

  ![Alt text](/postman_screens/get_image_by_id_image.png)

### Networks

#### 1. Get Networks

- **Endpoint:** GET http://localhost:3000/networks
- **Expected Result:**
  - Status: 200 OK
  - Response Body: List of Docker networks

  ![Alt text](/postman_screens/get_networks.png)

#### 2. Create Network

- **Endpoint:** POST http://localhost:3000/networks
- **Request Body:**
  ```json
  {
    "name": "new-network"
  }
  ```
- **Expected Result:**
  - Status: 200 OK
  - Response Body: Information about the created network

  ![Alt text](/postman_screens/create_network.png)

#### 3. Delete Network

- **Endpoint:** DELETE http://localhost:3000/networks/:id
- **Expected Result:**
  - Status: 200 OK
  - Response Body: Information about the removed network

  ![Alt text](/postman_screens/delete_network.png)


