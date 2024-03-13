const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, before } = require('mocha');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();
const url = process.env.URL;

chai.use(chaiHttp);
const expect = chai.expect;

const containerPayLoad = {
  "Hostname": "cnt-test-01",
  "Cmd": ["date"],
  "Image": "ubuntu"
};

describe('Containers', () => {
  let containerId;
  let apiKey;

  before(() => {
    apiKey = fs.readFileSync('api-key.txt', 'utf8').trim();
  });

  it('should create a new container', (done) => {
    chai.request(url)
      .post('/containers/create')
      .query({ name: 'container-' + Math.floor(Math.random() * 1000) + 100 })
      .set('x-api-key', apiKey)
      .send(containerPayLoad)
      .end((err, res) => {
        if (err) {
          console.error('Error:', err);
          return done(err);
        }
        if (res.statusCode !== 201) {
          console.error('Error:', res);
          return done(new Error('Failed to create container' + res));
        }
        containerId = res.body.Id;
        done();
      });
  });

  it('should check if the container exists', (done) => {
    if (!containerId) {
      return done(new Error('Container ID is not defined.'));
    }

    chai.request(url)
      .get(`/containers/${containerId}/json`)
      .set('x-api-key', apiKey)
      .end((err, res) => {
        if (err) {
          console.error('Error:', err);
          return done(err);
        }
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should return an array of containers', (done) => {
    chai.request(url)
      .get('/containers/json')
      .set('x-api-key', apiKey)
      .end((err, res) => {
        if (err) {
          console.error('Error:', err);
          return done(err);
        }
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should delete the created container', (done) => {
    if (!containerId) {
      return done(new Error('Container ID is not defined.'));
    }

    chai.request(url)
      .delete(`/containers/${containerId}`)
      .set('x-api-key', apiKey)
      .end((err, res) => {
        if (err) {
          console.error('Error:', err);
          return done(err);
        }
        expect(res.statusCode).to.equal(204);
        done();
      });
  });
});
