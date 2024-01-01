// tests/test.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../routes');
const { expect } = chai;

chai.use(chaiHttp);
