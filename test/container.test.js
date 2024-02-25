// authMiddleware.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const dotenv = require('dotenv');
dotenv.config();
const url = process.env.URL;

chai.use(chaiHttp);
const expect = chai.expect;
const fs = require('fs');


const containerPayLoad = {
  "Hostname": "cnt-test-01",
  "Cmd": ["date"],
  "Image": "ubuntu"
}




describe('Containers list', () => {
  let containerId;
  let apiKey;

  before(() => {
    apiKey = fs.readFileSync('api-key.txt', 'utf8').trim();
  });


  it('should create a new container', (done) => {
    chai.request(url)
      .post('/containers/create') // Adjust path if needed
      .query({ name: 'container-' + Math.floor(Math.random() * 1000) + 100 })
      .set('x-api-key', apiKey)
      .send(containerPayLoad)
      .end((err, res) => {
        if (err) {
          console.error('Error:', err);
          done(err);
          return;
        }
        // Assuming response contains container ID
        containerId = res.body.Id; // Adjust based on actual response
        expect(res).to.have.status(201); // Assuming 201 status for successful creation
        done();
      });
  });

  it('should check if the container exists', (done) => {
    // Check if containerId is defined
    if (!containerId) {
      done(new Error('Container ID is not defined.'));
      return;
    }

    chai.request(url)
      .get(`/containers/${containerId}/json`) // Adjust path if needed
      .set('x-api-key', apiKey)
      .end((err, res) => {
        if (err) {
          console.error('Error:', err);
          done(err);
          return;
        }
        // Assuming the response contains information about the container
        expect(res.body).to.be.an('object'); // Assuming the response is an object
        // Assert other conditions to verify the existence of the container
        done();
      });
  });


  it('should return an array', (done) => {

    chai.request(url)
      .get('/containers/json') // Adjust path if needed
      .set('x-api-key', apiKey)
      .end((err, res) => {
        if (err) {
          console.error('Error:', err);
          done(err);
          return;
        }
        expect(res.body).to.be.a("array");
        done();
      });
  });


  it('should delete the created container', (done) => {
    // Check if containerId is defined
    if (!containerId) {
      done(new Error('Container ID is not defined.'));
      return;
    }

    chai.request(url)
      .delete(`/containers/${containerId}`) // Adjust path if needed
      .set('x-api-key', apiKey)
      .end((err, res) => {
        if (err) {
          console.error('Error:', err);
          done(err);
          return;
        }
        expect(res).to.have.status(204); // Assuming 204 status for successful deletion
        done();
      });
  });






});











