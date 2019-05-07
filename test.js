const request = require('supertest')("http://localhost:8080");
const assert = require('chai').assert;
const expect = require('chai').expect;
const nock = require('nock');
const superagent = require('superagent');
const supertest = require('supertest');
const should = require('chai').should;

var chai = require('chai'), chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('./app');
const tdd = require('./tdd.js');

describe('GET /', function () {
    it("should return landing page", function (done) {
        chai.request(app)
            .get('/')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('GET /groceries', function () {
    it("should return grocery webpage", function (done) {
        chai.request(app)
            .get('/groceries')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('GET /electronics', function () {
    it("should return electronics webpage", function (done) {
        chai.request(app)
            .get('/electronics')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('GET /instruments', function () {
    it("should return instruments webpage", function (done) {
        chai.request(app)
            .get('/instruments')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe("POSTS /register", function () {
    it('should signup as mocha@gmail.com ', (done) => {
        chai.request.agent(app)
            .post('/register')
            .send({
                username: "mocha@gmail.com",
                password: "Test1234",
            });
            done();
    });
});

describe("GET /unknownPage", function () {
    it('should redirect for unknown route', function (done) {
        chai.request(app)
            .get('/unknown')
            .end(function(err, res) {
                expect(res).to.redirect;
                done();
            });
    });
});

describe("Test Login", function () {
    it("should produce 'Authenticated'", (done) => {
        let result = tdd.login('username', 'password');
        assert.equal(result, "Authenticated");
        done();
    });
    it("should produce 'Denied'", (done) => {
        let result =tdd.login('fake_username', 'fake_password');
        assert.equal(result, "Denied");
        done();
    });
});

describe("Test Prime", function () {
    it("should return 'Prime'", (done) => {
        let result = tdd.isPrime(7);
        assert.equal(result, "Prime");
        done();
    });
    it("should return 'Not Prime'", (done) => {
        let result = tdd.isPrime(4);
        assert.equal(result, "Not Prime");
        done();
    });
});