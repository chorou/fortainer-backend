// tests/test.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../routes');
const { expect } = chai;

chai.use(chaiHttp);

describe('Containers', () => {
  it('should get a list of containers', async () => {
    const res = await chai.request(app).get('/containers');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  // Ajoutez d'autres tests pour les routes des conteneurs
});

describe('Images', () => {
  it('should get a list of images', async () => {
    const res = await chai.request(app).get('/images');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  // Ajoutez d'autres tests pour les routes des images
});

describe('Networks', () => {
  it('should get a list of networks', async () => {
    const res = await chai.request(app).get('/networks');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  // Ajoutez d'autres tests pour les routes des réseaux
});
