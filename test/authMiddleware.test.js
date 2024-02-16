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

describe('Authentication Middleware', () => {
    let apiKey;

    before(() => {
        apiKey = fs.readFileSync('api-key.txt', 'utf8').trim();
    });
  
    it('should return 200 OK when the correct API key is provided', (done) => {
      console.log('URL:', url + "containers/json"); 
  
      chai.request(url)
      .get('/containers/json') // Adjust path if needed
      .set('x-api-key', apiKey)
      .end((err, res) => {
          if (err) {
              console.error('Error:', err);
              done(err);
              return;
          }
          expect(res).to.have.status(200);
          done();
      });
    });


      
});



 







/* it('should return 401 Unauthorized when no API key is provided', (done) => {
    chai.request(url)
      .get('/images/json') // Vous pouvez ajuster l'URL en fonction de votre configuration
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should return 401 Unauthorized when an incorrect API key is provided', (done) => {
    chai.request(url)
      .get('/docker-api') // Vous pouvez ajuster l'URL en fonction de votre configuration
      .set('x-api-key', 'incorrect-api-key') // Remplacez par une clé API incorrecte
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  }); */
